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
// CONNECTION TO DATABASE,
//========================
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// CONNECTION TEST
//=================
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("The database is ready.");
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
