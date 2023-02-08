// MODEL IMPORTATION
//===================
const Lesson = require("../models/LessonModel");
const Chapter = require("../models/ChapterModel");

// Perfect Illustration of One to many relationship.
const createLesson = async (req, res) => {
  try {
    let {
      chapterID,
      lessonNumber,
      lessonName,
      lessonNotes,
      lessonType,
      lessonUrl,
    } = req.body;
    let lessonData = {
      lessonNumber,
      lessonName,
      lessonNotes,
      lessonType,
      lessonUrl,
    };
    console.log(`Lesson Data to be saved : ${JSON.stringify(lessonData)}`);
    let newLesson = await Lesson.create(lessonData);
    newLesson.save();
    let { _id: lessonID } = newLesson; // Extracting ID from staved Lesson
    let chapterData = await Chapter.findByIdAndUpdate(
      chapterID,
      { $push: { chapterLessons: lessonID } },
      { new: true, useFindAndModify: false, runValidation: true }
    );
    if (chapterData._doc.chapterLessons.includes(lessonID)) {
      console.log("Lesson Data operation successfull.");
      res.sendStatus(201);
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
const findLesson = async (req, res) => {
  // All the data will already be appended by the units.
  const { lessonId } = req.params;
  try {
    let data = await Lesson.findById(lessonId);
    res.json(data);
  } catch (error) {
    res.status(500).send(error);
  }
};
const createLessonS3 = async (req, res) => {
  try {
    const { location } = req.file;
    console.log(`New Lesson Request. ${JSON.stringify(req.body)}`);
    // let { chapterName, lessonNumber, lessonName, lessonNotes } = req.body;
    let { chapterID, lessonNumber, lessonName, lessonNotes, lessonType } =
      req.body;
    // const lessonNotes =
    //   "Lorem ipsum dolor sit amet consectetur adipisicing elit. In quaerat error ratione sed eaque ducimus ex officiis, perferendis amet. Labore sed illo maxime magnam necessitatibus doloremque nulla dicta similique inventore.";
    console.log(`LessonNotes : ${lessonNotes}`);
    let lessonData = {
      lessonNumber,
      lessonName,
      lessonNotes,
      lessonType,
      lessonUrl: location,
    };
    console.log(`Lesson Data to be saved : ${lessonData}`);
    let newLesson = await Lesson.create(lessonData);
    newLesson.save();
    let { _id: lessonID } = newLesson; // Extracting ID from staved Lesson
    let chapterData = await Chapter.findByIdAndUpdate(
      chapterID,
      { $push: { chapterLessons: lessonID } },
      { new: true, useFindAndModify: false, runValidation: true }
    );
    if (chapterData._doc.chapterLessons.includes(lessonID)) {
      console.log("Lesson Data operation successfull.");
      res.sendStatus(201);
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

module.exports = { findLesson, createLesson, createLessonS3 };
