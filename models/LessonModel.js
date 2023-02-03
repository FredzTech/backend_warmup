const mongoose = require("mongoose");
const { Schema } = mongoose;

const LessonSchema = new Schema({
  lessonNumber: { type: String, required: true },
  lessonName: { type: String, required: true, uppercase: true },
  lessonNotes: { type: String },
  lessonType: { type: String, required: true },
  lessonUrl: { type: String, required: true },
});

// Creating a model.
const LessonModel = mongoose.model("Lesson", LessonSchema);
// Exporting the Model
module.exports = LessonModel;
