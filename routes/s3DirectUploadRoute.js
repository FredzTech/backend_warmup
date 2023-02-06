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
router.get("/:key", debugReq, (req, res) => {
  const key = req.params.key;
  console.log(key);
  const readStream = getFileStream(key);

  readStream.pipe(res);
});

router.post("/", getSignedUrl);

module.exports = router;
