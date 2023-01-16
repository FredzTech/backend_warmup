const mongoose = require("mongoose");

const { Schema } = mongoose;

const LessonSchema = new Schema({
  LNo: { type: Number, required: true },
  LName: { type: String, required: true },
  LVideo: { type: String, required: true },
  LNotes: { type: String },
});

// Creating a model.
const LessonModel = mongoose.model("Lesson", LessonSchema);
// Exporting the Model
module.exports = LessonModel;
