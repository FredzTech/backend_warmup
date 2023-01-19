const express = require("express");
const router = express.Router();
const fs = require("fs"); //Enables us to interact with the servers fs performing crud ops to it.
const util = require("util"); //Kinda revolutionalizes fs methods to promises which become sweeter to handle.s
const unlinkFile = util.promisify(fs.unlink); //Nispy method for deleting files.
const multer = require("multer");

// CONTROLLERS IMPORTATIONS.
//===========================
const { createLesson } = require("../controllers/LessonController");
const { getFileStream, uploadFile } = require("../controllers/s3Controller");

// CONFIGURING MULTER.
//====================
const upload = multer({ dest: "uploads/" }); //This is our shot for filtering our uploads.

// CRUD OPERATIONS
//=================
// CREATING A DOCUMENT.
// When creating a lesson, we would like to save the lesson id to its respective chapter.
router.post(
  "/new-lesson",
  upload.single("video"),
  async (req, res, next) => {
    try {
      console.log("Finished upload to server.");
      const file = req.file;
      const result = await uploadFile(file);
      console.log("Finished upload to bucket");
      await unlinkFile(file.path);
      console.log(result);
      req.result = result;
      console.log(`Additional info for save 
    =======================`);
      console.log(`${JSON.stringify(req.body)}`);
      // OBJECT TO RETURNED AFTER SAVE.

      // res.send({ imagePath: `/images/${result.Key}` });
      next();
    } catch (err) {
      console.log("Error that occured instead of crashing!");
      console.log(JSON.stringify(err));
    }
  },
  createLesson
);

// EXPORTING A MODEL.
module.exports = router;
