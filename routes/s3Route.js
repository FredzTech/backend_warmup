// PRIMARY MODULES
//================
const express = require("express");
const router = express.Router();
const fs = require("fs"); //Enables us to interact with the servers fs performing crud ops to it.
const util = require("util"); //Kinda revolutionalizes fs methods to promises which become sweeter to handle.s
const unlinkFile = util.promisify(fs.unlink); //Nispy method for deleting files.
const multer = require("multer");

// CONTROLLERS IMPORTATIONS.
//===========================
const { getFileStream, uploadFile } = require("../controllers/s3Controller");

// CONFIGURING MULTER.
//====================
const upload = multer({ dest: "uploads/" }); //This is our shot for filtering our uploads.

// OUR GRACIOUS ROUTES
//=====================
router.get(
  "/images/:key",
  (req, res, next) => {
    console.log("Request received");
    next();
  },
  (req, res) => {
    const key = req.params.key;
    const readStream = getFileStream(key);

    readStream.pipe(res);
  }
);

router.post("/images", upload.single("image"), async (req, res) => {
  const file = req.file;

  const result = await uploadFile(file);
  await unlinkFile(file.path);
  console.log(`Object from multer`);
  console.log(result);
  console.log(`Additional Info ${req.body}`);

  res.send({ imagePath: `/images/${result.Key}` });
});

router.post(
  "/upload-resources",
  upload.single("resource"),
  async (req, res) => {
    const file = req.file;
    const result = await uploadFile(file);
    await unlinkFile(file.path);
    console.log(result);
    console.log(`Additional info for save 
  =======================`);
    console.log(`${JSON.stringify(req.body)}`);
    // OBJECT TO RETURNED AFTER SAVE.

    res.send({ imagePath: `/images/${result.Key}` });
  }
);

module.exports = router;
