const express = require("express");
const router = express.Router();
const fs = require("fs"); //Enables us to interact with the servers fs performing crud ops to it.
const util = require("util"); //Kinda revolutionalizes fs methods to promises which become sweeter to handle.s
const unlinkFile = util.promisify(fs.unlink); //Nispy method for deleting files.
const multer = require("multer");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
require("dotenv/config");

// CONTROLLERS IMPORTATIONS.
//===========================
const {
  createLesson,
  createLessonS3,
} = require("../controllers/LessonController");
const { getFileStream, uploadFile } = require("../controllers/s3Controller");

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
// CONFIGURING MULTER.
//====================
// const upload = multer({ dest: "uploads/" }); //This is our shot for filtering our uploads.

// CRUD OPERATIONS
//=================
// CREATING A DOCUMENT.
// When creating a lesson, we would like to save the lesson id to its respective chapter.
// router.post(
//   "/new-lesson",
//   upload.single("video"),
//   async (req, res, next) => {
//     try {
//       console.log("Finished upload to server.");
//       const file = req.file;
//       const result = await uploadFile(file);
//       console.log("Finished upload to bucket");
//       await unlinkFile(file.path);
//       console.log(result);
//       req.result = result;
//       console.log(`Additional info for save
//     =======================`);
//       console.log(`${JSON.stringify(req.body)}`);
//       // OBJECT TO RETURNED AFTER SAVE.

//       // res.send({ imagePath: `/images/${result.Key}` });
//       next();
//     } catch (err) {
//       console.log("Error that occured instead of crashing!");
//       console.log(JSON.stringify(err));
//     }
//   },
//   createLesson
// );

router.post("/new-lesson", upload.single("video"), createLessonS3);
// EXPORTING A MODEL.
module.exports = router;
