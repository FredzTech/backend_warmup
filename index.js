if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const jwt = require("jsonwebtoken");

const express = require("express");
const port = process.env.PORT || 4000;
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
// ROUTES IMPORTATION
//====================
const LessonRoute = require("./routes/LessonRoute");
const ChapterRoute = require("./routes/ChapterRoute");
const S3Route = require("./routes/s3Route");
const CourseRoute = require("./routes/CourseRoute");
const UnitRoute = require("./routes/UnitRoute");
const AuthRoute = require("./routes/AuthRoute");
const MulterS3Route = require("./routes/MulterS3Route");
const S3DirectUpload = require("./routes/s3DirectUploadRoute");
// CONNECTION TO DATABASE,
//========================
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// CONNECTION TEST
//=================
const db = mongoose.connection;
// CONNECTION ERROR HANDLING
db.on("open", function (ref) {
  connected = true;
  console.log("open connection to mongo server.");
});

db.on("connected", function (ref) {
  connected = true;
  console.log("connected to mongo server.");
});

db.on("disconnected", function (ref) {
  connected = false;
  console.log("disconnected from mongo server.");
});

db.on("close", function (ref) {
  connected = false;
  console.log("close connection to mongo server");
});

db.on("error", function (err) {
  connected = false;
  if (err.code == "ESERVFAIL") {
    console.log("Network Error");
  } else {
    console.log("error connection to mongo server!");
  }
});

db.on("reconnect", function (ref) {
  connected = true;
  console.log("reconnect to mongo server.");
});

// MIDDLEWARE DECLARATION
//=========================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
// ROUTES DEFINATION
//====================
app.use("/chapter", ChapterRoute);
app.use("/lesson", LessonRoute);
app.use("/s3", S3Route);
app.use("/s3Direct", S3DirectUpload);
// app.use("/s3", MulterS3Route);
app.use("/course", CourseRoute);
// app.use("/course", MulterS3Route);

app.use("/unit", UnitRoute);
app.use("/auth", AuthRoute);

// ROUTE DEFINATION
app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from warmup server." });
});

app.listen(port, () => {
  console.log(`Warmup server is live @ ${port}`);
});
