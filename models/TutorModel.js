const mongoose = require("mongoose");
const { Schema } = mongoose;

// Creates a model for saving customer credentials to the database.
//==================================================================
const TutorSchema = new Schema(
  {
    firstName: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    contact: { type: String, required: true },
    paid: { type: Boolean, required: true, default: false },
    units: [{ type: mongoose.Schema.Types.ObjectId, ref: "Unit" }],
    role: {
      type: String,
      required: true,
      default: "tutor",
    },
  },
  {
    timestamps: true,
  }
);

const Tutor = mongoose.model("Tutor", TutorSchema);

module.exports = Tutor;
