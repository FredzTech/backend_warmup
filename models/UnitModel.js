const mongoose = require("mongoose");

const { Schema } = mongoose;

const UnitSchema = new Schema({
  unitCode: { type: String, required: true, unique: true, uppercase: true },
  unitName: { type: String, required: true, uppercase: true },
  unitDescription: { type: String, required: true },
  unitChapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }],
});

const Unit = mongoose.model("Unit", UnitSchema);

module.exports = Unit;
