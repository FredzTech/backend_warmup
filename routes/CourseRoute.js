const express = require("express");
const router = express.Router();
const fs = require("fs"); //Enables us to interact with the servers fs performing crud ops to it.
const util = require("util"); //Kinda revolutionalizes fs methods to promises which become sweeter to handle.s
const unlinkFile = util.promisify(fs.unlink); //Nispy method for deleting files.
const multer = require("multer");

// CONTROLLERS IMPORTATIONS.
//===========================
const {
  createCourse,
  findAllCourses,
} = require("../controllers/CourseController");

const { getFileStream, uploadFile } = require("../controllers/s3Controller");
// CONFIGURING MULTER.
//====================
const upload = multer({ dest: "uploads/" }); //This is our shot for filtering our uploads.

// CRUD OPERATIONS
//=================
// CREATING A DOCUMENT.
router.post(
  "/new-course",
  (req, res, next) => {
    console.log("Request received");
    next();
  },
  upload.single("course"),
  async (req, res, next) => {
    const file = req.file;
    const result = await uploadFile(file);
    await unlinkFile(file.path);
    req.results = result;
    next();
  },
  createCourse
);

// router.post(
//   "/new-course",
//   async (req, res) => {
//     try {
//       console.log(`New Course Request. ${JSON.stringify(req.body)}`);
//       let { CourseImage, CourseTitle } = req.body;
//       let CourseData = { CourseImage, CourseTitle };
//       let NewCourse = await Course.create(CourseData);
//       NewCourse.save();
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   },
//   createCourse
// );

// READING THE DOCUMENT
//======================
router.get("/allChapters", findAllCourses);
// EXPORTING A MODEL.

module.exports = router;
