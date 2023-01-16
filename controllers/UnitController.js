// MODEL IMPORTATION
//===================
const Unit = require("../models/UnitModel");
const Course = require("../models/CourseModel");

// Perfect Illustration of One to many relationship.
const createUnit = async (req, res) => {
  try {
    console.log(`New Lesson Request. ${JSON.stringify(req.body)}`);
    let { CourseTitle, UnitNo, UnitName, UnitDescription, UnitChapters } =
      req.body;
    let UnitData = { UnitNo, UnitName, UnitDescription, UnitChapters };
    let NewUnit = await Unit.create(UnitData);
    NewUnit.save();
    let { _id: unitID } = NewUnit; // Extracting ID from staved Lesson
    let { _id: courseID } = await Course.findOne({ CourseTitle }); //Taking the ID of C Lesson
    let CourseData = await Course.findByIdAndUpdate(
      courseID,
      { $push: { Units: unitID } },
      { new: true, useFindAndModify: false, runValidation: true }
    );
    if (CourseData._doc.Units.includes(unitID)) {
      // We can safely say that the unit has been created.
      res.status(201);
    }
  } catch (err) {
    console.log(err);

    res.status(500).json(err);
  }
};

module.exports = { createUnit };
