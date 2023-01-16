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
router.post("/upload-courses", upload.single("Course"), async (req, res) => {
  const file = req.file;
  const result = await uploadFile(file);
  await unlinkFile(file.path);
  console.log(result);
  console.log(`Additional info for save 
  =======================`);
  console.log(`${JSON.stringify(req.body)}`);
  // OBJECT TO RETURNED AFTER SAVE.WE LET THE DB TAKE OVER.

  res.send({ imagePath: `/images/${result.Key}` });
});

router.post("/newChapter", createCourse);

// READING THE DOCUMENT
//======================
router.get("/allChapters", findAllCourses);
// EXPORTING A MODEL.

module.exports = router;
