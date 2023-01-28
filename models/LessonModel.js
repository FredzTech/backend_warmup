const mongoose = require("mongoose");

const { Schema } = mongoose;

const LessonSchema = new Schema({
  lessonNumber: { type: Number, required: true, unique: true },
  lessonName: { type: String, required: true, uppercase: true },
  lessonType: { type: String, required: true },
  lessonUrl: { type: String, required: true },
  lessonNotes: { type: String, required: true },
});

// Creating a model.
const LessonModel = mongoose.model("Lesson", LessonSchema);
// Exporting the Model
module.exports = LessonModel;
