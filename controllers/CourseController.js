// MODEL IMPORTATION
//===================
const Course = require("../models/CourseModel");

const createCourse = async (req, res) => {
  try {
    console.log(`New Course Upload Request. ${JSON.stringify(req.results)}`);
    let { courseTitle } = req.body;
    let { Location: courseImage } = req.results;
    let courseData = { courseTitle, courseImage };
    console.log(courseData);
    let newCourse = await Course.create(courseData);
    newCourse.save();
    console.log("Course Data saved successfully");
    res.status(201);
  } catch (err) {
    // DESTRUCTURING MONGODB ATLAS ERROR.
    if (err.code == 11000) {
      console.log(JSON.stringify(err));
      let errorBody = { message: "This course already exists!" };
      res.status(400).json(errorBody);
    } else {
      let { _message, name } = err;
      let errorBody = { _message, name };
      res.status(400).json(errorBody);
    }
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
