require("dotenv/config");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");

// CONTROLLERS IMPORTATIONS.
//===========================
const {
  createCourse,
  findAllCourses,
  fileCleanup,
  createCourseS3,
  findCourse,
  createCourseDirect,
} = require("../controllers/CourseController");

// CONFIGURING MULTER.
//====================
// const upload = multer({ dest: "uploads/" }); //This is our shot for filtering our uploads.

// CONFIGURING DETAILS.
//======================
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_BUCKET_REGION,
});

// ACKNOWLEDGES REQUEST.
const debugReq = (req, res, next) => {
  console.log("Upload request acknowledged.");
  next();
};

// CONFIGURING MULTER S3
//=======================
const storage = multerS3({
  s3,
  bucket: process.env.AWS_BUCKET_NAME,
  metadata: function (req, file, cb) {
    //This is where we store the additional data that we need later on to store in our database.
    console.log(file);
    cb(null, { fieldName: file.fieldname, originalName: file.originalname });
  },
  key: function (req, file, cb) {
    cb(null, `pol-${Date.now()}.${file.mimetype.split("/")[1]}`);
    // cb(null, `trial-${Date.now()}.pdf`);
  },
});

// CONFIGURING THE UPLOAD TO STORAGE SPECIFIED,
//==================================================
const upload = multer({
  storage,
});

// CRUD OPERATIONS
//=================
// CREATING A DOCUMENT.
// router.post(
//   "/new-course",
//   debugReq,
//   upload.single("course"),
//   fileCleanup,
//   createCourse
// );

router.get("/", (req, res) => {
  console.log("Welcome to course page.");
});

// router.post(
//   "/new-course",
//   debugReq,
//   upload.single("course"),
//   (req, res, next) => {
//     console.log("Req has finished executing.");
//     console.log(req.file);
//     console.log("We can now proceed to save this data inside our database.");
//     next();
//   },
//   createCourseS3
// );

router.post("/new-course", createCourseDirect);

// READING THE DOCUMENT
//======================
router.get(
  "/all-courses",

  findAllCourses
);

router.get(
  "/:courseId",
  (req, res, next) => {
    console.log("Request received");
    console.log(req.params);
    next();
  },
  findCourse
);
// EXPORTING A MODEL.

module.exports = router;
