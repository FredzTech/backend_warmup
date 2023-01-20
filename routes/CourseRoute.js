const express = require("express");
const router = express.Router();
const multer = require("multer");

// CONTROLLERS IMPORTATIONS.
//===========================
const {
  createCourse,
  findAllCourses,
  fileCleanup,
} = require("../controllers/CourseController");

// CONFIGURING MULTER.
//====================
const upload = multer({ dest: "uploads/" }); //This is our shot for filtering our uploads.

const debugReq = (req, res, next) => {
  console.log("Request acknowledged.Commencing Upload.");
  next();
};
// CRUD OPERATIONS
//=================
// CREATING A DOCUMENT.
router.post(
  "/new-course",
  debugReq,
  upload.single("course"),
  fileCleanup,
  createCourse
);

// READING THE DOCUMENT
//======================
router.get(
  "/all-courses",
  (req, res, next) => {
    console.log("Request received");
    next();
  },
  findAllCourses
);
// EXPORTING A MODEL.

module.exports = router;
