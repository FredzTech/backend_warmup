const express = require("express");
const router = express.Router();

const debugReq = (req, res, next) => {
  console.log("Get request for course data acknowledged.");
  next();
};

// Importing the controllers needed.
const {
  sendUploadUrl,
  getFileStream,
  getSignedUrl,
} = require("../controllers/s3DirectUploadController");

// Defining the routes.
router.get("/:key", debugReq, async (req, res) => {
  try {
    const key = req.params.key;
    console.log(key);
    // Extremely crucial to await the data being sent to the client.
    const readStream = await getFileStream(key);
    // console.log(readStream);
    readStream.pipe(res);
  } catch (err) {
    console.log(err);
    res.status(404).send(err);
  }
});

router.post("/", getSignedUrl);

module.exports = router;
