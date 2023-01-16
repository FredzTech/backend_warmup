const express = require("express");
const router = express.Router();
// CONTROLLERS IMPORTATIONS.
//===========================
const { createUnit } = require("../controllers/UnitController");

// CRUD OPERATIONS
//=================
// CREATING A DOCUMENT.
// When creating a lesson, we would like to save the lesson id to its respective chapter.
router.post("/new-unit", createUnit);

// EXPORTING A MODEL.
module.exports = router;
