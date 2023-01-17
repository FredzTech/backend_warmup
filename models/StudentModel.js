const mongoose = require("mongoose");
const { Schema } = mongoose;

// Creates a model for saving customer credentials to the database.
//==================================================================
const StudentSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    paid: { type: Boolean, required: true, default: false },
    role: {
      type: String,
      required: true,
      default: "student",
    },
  },
  {
    timestamps: true,
  }
);

// // Hashes our password b4 saving to the DB
// //==========================================
// CredentialSchema.pre("save", async (req, res, next) => {
//   try {
//     const hashedPassword = await bcrypt.hash(this.password, 10);
//     this.password = hashedPassword;
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;
