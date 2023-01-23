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
      res.status(400).json(err);
    }
  }
};

const createLessonS3 = async (req, res) => {
  try {
    const { location } = req.file;
    console.log(`New Lesson Request. ${JSON.stringify(req.body)}`);
    // let { chapterName, lessonNumber, lessonName, lessonNotes } = req.body;
    let { chapterName, lessonNumber, lessonName } = req.body;
    const lessonNotes =
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. In quaerat error ratione sed eaque ducimus ex officiis, perferendis amet. Labore sed illo maxime magnam necessitatibus doloremque nulla dicta similique inventore.";

    let lessonData = {
      lessonNumber,
      lessonName,
      lessonNotes,
      lessonVideo: location,
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
      res.status(400).json(err);
    }
  }
};

module.exports = { createLesson, createLessonS3 };
