// MODEL IMPORTATION
//===================
const Unit = require("../models/UnitModel");
const Course = require("../models/CourseModel");

// Perfect Illustration of One to many relationship.
const createUnit = async (req, res) => {
  try {
    console.log(`New Unit Request. ${JSON.stringify(req.body)}`);
    let { courseTitle, unitNo, unitName, unitDescription } = req.body;
    let unitData = {
      unitNo,
      unitName,
      unitDescription,
    };
    let newUnit = await Unit.create(unitData);
    newUnit.save();
    let { _id: unitID } = newUnit; // Extracting ID from staved Lesson
    let { _id: courseID } = await Course.findOne({ courseTitle }); //Taking the ID of C Lesson
    let courseData = await Course.findByIdAndUpdate(
      courseID,
      { $push: { Units: unitID } },
      { new: true, useFindAndModify: false, runValidation: true }
    );
    if (courseData._doc.Units.includes(unitID)) {
      // We can safely say that the unit has been created.
      res.status(201);
    }
  } catch (err) {
    console.log(err);

    res.status(500).json(err);
  }
};

module.exports = { createUnit };
