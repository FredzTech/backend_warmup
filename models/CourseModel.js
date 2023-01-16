const mongoose = require("mongoose");

const { Schema } = mongoose;

const CourseSchema = new Schema({
  CourseImage: { type: String, required: true, uppercase: true },
  CourseTitle: { type: String, required: true, unique: true },
  Units: [{ type: mongoose.Schema.Types.ObjectId, ref: "Unit" }],
});

const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;
