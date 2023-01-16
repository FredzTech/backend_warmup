// MODEL IMPORTATION
//===================
const Lesson = require("../models/LessonModel");
const Chapter = require("../models/ChapterModel");

// Perfect Illustration of One to many relationship.
const createLesson = async (req, res) => {
  try {
    console.log(`New Lesson Request. ${JSON.stringify(req.body)}`);
    let { CName, LNo, LName, LVideo, LNotes } = req.body;
    let lessonData = { LNo, LName, LVideo, LNotes };
    let NewLesson = await Lesson.create(lessonData);
    NewLesson.save();
    let { _id: lessonID } = NewLesson; // Extracting ID from staved Lesson
    let { _id: chapterID } = await Chapter.findOne({ CName }); //Taking the ID of C Lesson
    let ChapterData = await Chapter.findByIdAndUpdate(
      chapterID,
      { $push: { CLessons: lessonID } },
      { new: true, useFindAndModify: false, runValidation: true }
    );
    if (ChapterData._doc.CLessons.includes(lessonID)) {
      res.status(201);
    }
  } catch (err) {
    console.log(err);

    res.status(500).json(err);
  }
};

module.exports = { createLesson };
