const mongoose = require("mongoose");

const { Schema } = mongoose;

const UnitSchema = new Schema({
  UnitNo: { type: Number, required: true, unique: true },
  UnitName: { type: String, required: true, uppercase: true },
  UnitDescription: { type: String, required: true },
  UnitChapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }],
});

const Unit = mongoose.model("Unit", UnitSchema);

module.exports = Unit;
