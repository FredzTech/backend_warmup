// MODEL IMPORTATION
//===================
const Course = require("../models/CourseModel");

const createCourse = async (req, res) => {
  try {
    console.log(`New Request. ${JSON.stringify(req.body)}`);
    let { CourseImage, CourseTitle } = req.body;
    let CourseData = { CourseImage, CourseTitle };
    let NewCourse = await Course.create(CourseData);
    NewCourse.save();
    res.status(201).json(chapterData);
  } catch (err) {
    res.status(500).json(err);
  }
};

const findAllCourses = async (req, res) => {
  // All the data will already be appended by the units.
  try {
    let data = await Chapter.find({}).populate("CLessons");
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error);
  }
};
module.exports = { createCourse, findAllCourses };
