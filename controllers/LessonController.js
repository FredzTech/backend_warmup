// MODEL IMPORTATION
//===================
const Lesson = require("../models/LessonModel");
const Chapter = require("../models/ChapterModel");

// Perfect Illustration of One to many relationship.
const createLesson = async (req, res) => {
  try {
    console.log(req.result);
    const { Location, Key } = req.result;
    console.log(`New Lesson Request. ${JSON.stringify(req.body)}`);
    let { chapterName, lessonNumber, lessonName, lessonNotes } = req.body;
    let lessonData = {
      lessonNumber,
      lessonName,
      lessonNotes,
      lessonVideo: Location,
    };
    console.log(`Data to be saved`);
    console.log(lessonData);
    let newLesson = await Lesson.create(lessonData);
    newLesson.save();
    let { _id: lessonID } = newLesson; // Extracting ID from staved Lesson
    let { _id: chapterID } = await Chapter.findOne({ chapterName }); //Taking the ID of C Lesson
    let chapterData = await Chapter.findByIdAndUpdate(
      chapterID,
      { $push: { chapterLessons: lessonID } },
      { new: true, useFindAndModify: false, runValidation: true }
    );
    if (chapterData._doc.chapterLessons.includes(lessonID)) {
      console.log("Lesson Data operation successfull.");
      res.status(201);
    }
  } catch (err) {
    if (err.code == 11000) {
      console.log(JSON.stringify(err));
      let errorBody = { message: "This lesson already exists!" };
      res.status(400).json(errorBody);
    } else {
      let { _message, name } = err;
      let errorBody = { _message, name };
      res.status(400).json(errorBody);
    }
  }
};

module.exports = { createLesson };
