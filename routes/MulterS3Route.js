const express = require("express");
const router = express.Router();
const multer = require("multer");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
require("dotenv/config");
const { createCourseS3 } = require("../controllers/CourseController");

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
// POINTING UPLOAD TO MULTER S3
//==============================
const upload = multer({
  storage,
});

router.post(
  "/new-course",
  debugReq,
  upload.single("course"),
  (req, res, next) => {
    console.log("Req has finished executing.");
    console.log(req.file);
    console.log("We can now proceed to save this data inside our database.");
    next();
  },
  createCourseS3
);

module.exports = router;
