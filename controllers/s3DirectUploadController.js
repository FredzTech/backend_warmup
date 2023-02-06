require("dotenv").config();
const crypto = require("crypto");
const S3 = require("aws-sdk/clients/s3");
const { promisify } = require("util");
const randomBytes = promisify(crypto.randomBytes);
const fs = require("fs");
// S3 CREDENTIALS
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

// Configuring credentials
//========================
const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
  // We shall specify version if needed.
});

// Fetches our file in a stream. Meaning we can start consuming our data as it arrives.
function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  return s3.getObject(downloadParams).createReadStream();
}

// Only interested with the file type.
const getSignedUrl = async (req, res) => {
  console.log(`Get signed URL Body ${JSON.stringify(req.body)}`);
  const { fileType } = req.body;
  const rawBytes = await randomBytes(16);
  const fileName = rawBytes.toString("hex"); //Geneerates a random filename.
  const fileExtension = fileType && fileType.split("/")[1];
  const Key = `${fileName}.${fileExtension}`;
  console.log(`File name during signing URL ${Key} & fileType ${fileType}`);
  const params = {
    Bucket: bucketName,
    ContentType: fileType,
    Key: Key,
    Expires: 400,
  };

  const signedUrl = await s3.getSignedUrlPromise("putObject", params);
  res.status(201).json({ signedUrl, Key });
};

// EXPORTING THE TWO FUNCTIONS CREATED.
//======================================
module.exports = { getSignedUrl, getFileStream };
