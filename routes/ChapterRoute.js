const express = require("express");
const router = express.Router();

const {
  createChapter,
  findAllChapters,
} = require("../controllers/ChapterController");
// CRUD OPERATIONS
//=================
// CREATING A DOCUMENT.
router.post("/newChapter", createChapter);

// READING THE DOCUMENT
//======================
router.get("/allChapters", findAllChapters);
// EXPORTING A MODEL.
module.exports = router;
