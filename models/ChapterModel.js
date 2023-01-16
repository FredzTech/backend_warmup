const mongoose = require("mongoose");

const { Schema } = mongoose;

const ChapterSchema = new Schema({
  CNo: { type: Number, required: true, unique: true },
  CName: { type: String, required: true, uppercase: true },
  CDescription: { type: String, required: true },
  CLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
});

const Chapter = mongoose.model("Chapter", ChapterSchema);

module.exports = Chapter;
