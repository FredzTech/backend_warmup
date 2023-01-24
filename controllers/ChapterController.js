// MODEL IMPORTATION
//===================
const Chapter = require("../models/ChapterModel");
const Unit = require("../models/UnitModel");
const createChapter = async (req, res) => {
  try {
    console.log(`New Request. ${JSON.stringify(req.body)}`);
    let { unitName, chapterNumber, chapterName, chapterDescription } = req.body;
    let chapterData = {
      chapterNumber,
      chapterName,
      chapterDescription,
    };
    let newChapter = await Chapter.create(chapterData);
    newChapter.save();
    let { _id: chapterID } = newChapter;
    let { _id: unitID } = await Unit.findOne({ unitName });
    console.log(unitID);
    if (unitID !== null || unitID !== undefined) {
      let unitData = await Unit.findByIdAndUpdate(
        unitID,
        { $push: { unitChapters: chapterID } },
        { new: true, useFindAndModify: false, runValidation: true }
      );
      if (unitData._doc.unitChapters.includes(chapterID)) {
        res.status(201);
      } else {
        res
          .status(500)
          .send({ message: "Something went wrong while updating Unit model" });
      }
      res.status(201).json(chapterData);
    } else {
      res.status(400).json({ message: "Chapter not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const findAllChapters = async (req, res) => {
  try {
    let data = await Chapter.find({});
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error);
  }
};

const populateAllChapters = async (req, res) => {
  try {
    let data = await Chapter.find({}).populate("ChapterLessons");
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error);
  }
};
module.exports = { createChapter, findAllChapters,populateAllChapters };
