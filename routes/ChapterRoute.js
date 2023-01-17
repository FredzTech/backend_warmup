const express = require("express");
const router = express.Router();

const {
  createChapter,
  findAllChapters,
} = require("../controllers/ChapterController");
// CRUD OPERATIONS
//=================
// CREATING A DOCUMENT.
router.post("/new-chapter", createChapter);

// READING THE DOCUMENT
//======================
router.get("/all-chapters", findAllChapters);
// EXPORTING A MODEL.
module.exports = router;
