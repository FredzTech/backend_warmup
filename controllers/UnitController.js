// MODEL IMPORTATION
//===================
const Unit = require("../models/UnitModel");
const Course = require("../models/CourseModel");

const getAllUnits = async (req, res) => {
  try {
    const unitsData = await Unit.find({});
    res.status(201).json(unitsData);
  } catch (error) {
    res.status(500).send(error);
  }
};
// Perfect Illustration of One to many relationship.
const createUnit = async (req, res) => {
  try {
    let { courseTitle, unitCode, unitName, unitDescription } = req.body;
    let unitData = {
      unitCode,
      unitName,
      unitDescription,
    };
    console.log(unitData);
    let newUnit = await Unit.create(unitData);
    newUnit.save();
    let { _id: unitID } = newUnit; // Extracting ID from staved Lesson
    let { _id: courseID } = await Course.findOne({ courseTitle }); //Taking the ID of C Lesson
    if (courseID == null || courseID == undefined) {
      res.status(400).json({ message: "Course not found" });
    } else {
      let courseData = await Course.findByIdAndUpdate(
        courseID,
        { $push: { units: unitID } },
        { new: true, useFindAndModify: false, runValidation: true }
      );
      if (courseData._doc.units.includes(unitID)) {
        // We can safely say that the unit has been created.
        res.status(201);
      }
    }
  } catch (err) {
    if (err.code == 11000) {
      console.log(JSON.stringify(err));
      let errorBody = { message: "This unit already exists!" };
      res.status(400).json(errorBody);
    } else {
      let { _message, name } = err;
      let errorBody = { _message, name };
      res.status(400).json(errorBody);
    }
  }
};

module.exports = { createUnit, getAllUnits };
