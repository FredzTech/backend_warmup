const fs = require("fs"); //Enables us to interact with the servers fs performing crud ops to it.
const util = require("util"); //Kinda revolutionalizes fs methods to promises which become sweeter to handle.s
const unlinkFile = util.promisify(fs.unlink); //Nispy method for deleting files.

const { getFileStream, uploadFile } = require("../controllers/s3Controller");

// MODEL IMPORTATION
//===================
const Course = require("../models/CourseModel");

const fileCleanup = async (req, res, next) => {
  const file = req.file;
  const result = await uploadFile(file);
  await unlinkFile(file.path);
  req.results = result;
  next();
};
const createCourse = async (req, res) => {
  try {
    console.log("Upload success. Saving to database!");
    let { courseTitle } = req.body;
    let { Location: courseImage } = req.results;
    let courseData = { courseTitle, courseImage };
    let newCourse = await Course.create(courseData);
    newCourse.save();
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
    let data = await Course.find({}); //Find everything for me.
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error);
  }
};
module.exports = { createCourse, findAllCourses, fileCleanup };
