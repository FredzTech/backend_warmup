// MODEL IMPORTATION
//===================
const Chapter = require("../models/ChapterModel");

const createChapter = async (req, res) => {
  try {
    console.log(`New Request. ${JSON.stringify(req.body)}`);
    let { CNo, CName, CDescription } = req.body;
    let chapterData = { CNo, CName, CDescription };
    let NewChapter = await Chapter.create(chapterData);
    NewChapter.save();
    res.status(201).json(chapterData);
  } catch (err) {
    res.status(500).json(err);
  }
};

const findAllChapters = async (req, res) => {
  try {
    let data = await Chapter.find({}).populate("CLessons");
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error);
  }
};
module.exports = { createChapter, findAllChapters };
