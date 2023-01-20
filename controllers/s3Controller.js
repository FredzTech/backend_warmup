require("dotenv").config();
const fs = require("fs");
const S3 = require("aws-sdk/clients/s3");

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
});

// Function to upload file to s3
//===============================
function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path); //We send data in buffers as we receive it.
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    // Key: file.filename, //These defines the name of the file on the bucket.
    Key: `warm-${Date.now()}.${file.mimetype.split("/")[1]}`,
  };

  return s3.upload(uploadParams).promise(); //The guy that handles the upload from the parameters given.
}

// Function to download files from s3
//====================================
function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  return s3.getObject(downloadParams).createReadStream();
}

// EXPORTING THE TWO FUNCTIONS CREATED.
//======================================
exports.getFileStream = getFileStream;
exports.uploadFile = uploadFile;
