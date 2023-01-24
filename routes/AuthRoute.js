const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
  authenticateToken,
} = require("../controllers/AuthController");
require("dotenv").config();
const jwt = require("jsonwebtoken");

// MODELS SECTION
const Student = require("../models/StudentModel");
const Tutor = require("../models/TutorModel");
const RefreshToken = require("../models/RefreshTokensModel");

// DATA TO BE ACCESSED.
//=====================
const posts = [
  {
    username: "Kyle",
    title: "Post 1",
  },
  {
    username: "Benson",
    role: [0535, 0534],
    title: "Hello this is my info as Benson.",
  },
  {
    username: "Alfred",
    title: "Post 2",
  },
  {
    username: "Joan",
    title: "Post 3",
  },
];

// CONSUMING CONTENT.
//===================
router.get("/posts", authenticateToken, (req, res) => {
  console.log(`Payload to be utilized ${req.user}`);
  res.json(posts.filter((post) => post.username === req.user.name));
});

// GENERATES THE REFRESH & ACCESS TOKENS
//========================================
router.post("/register-student", async (req, res) => {
  try {
    console.log(req.body);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    let credentials = {
      firstName: req.body.firstName,
      surname: req.body.surname,
      email: req.body.email,
      contact: req.body.contact,
      password: hashedPassword,
    };
    const student = await Student.create(credentials);
    student.save();
    res
      .status(201)
      .json({ message: "Student has been registered successfully." });
  } catch (err) {
    if (err.code == 11000) {
      console.log(JSON.stringify(err));
      let errorBody = { message: "This student already exists!" };
      res.status(400).json(errorBody);
    } else {
      console.log(err);
      let { _message, name } = err;
      let errorBody = { _message, name };
      res.status(400).json(errorBody);
    }
  }
});

router.post("/register-tutor", async (req, res) => {
  try {
    console.log(req.body);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    let credentials = {
      firstName: req.body.firstName,
      surname: req.body.surname,
      email: req.body.email,
      contact: req.body.contact,
      password: hashedPassword,
      role: "tutor",
    };
    const tutor = await Tutor.create(credentials);
    tutor.save();
    res.status(201);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

// GENERATES THE REFRESH & ACCESS TOKENS
//========================================
router.post("/student-login", async (req, res) => {
  // Retrieving user credentials from our database.
  let studentData = await Student.findOne({ firstName: req.body.FirstName });
  console.log("Student Found :-");
  console.log(studentData);
  if (studentData == null) {
    res.status(401).json({ message: "User not found" });
  } else {
    const { firstName, lastName, role, password } = studentData;
    // Step 2 : Comparing passwords using bcrypt compare function.
    try {
      if (await bcrypt.compare(req.body.password, password)) {
        // Step 2 : Generating User Payload, if the user is valid.
        const user = { firstName, lastName, role }; //Our payload.
        // Step 3 : Generating the access & refresh tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        //Step 4 : Saving a copy of the refresh token to our database.
        let { _id: tokenID } = await RefreshToken.findOne({ name: "tokens" }); //Taking the ID of C Lesson
        let refreshTokenData = await RefreshToken.findByIdAndUpdate(
          tokenID,
          { $push: { data: refreshToken } },
          { new: true, useFindAndModify: false, runValidation: true }
        );
        if (refreshTokenData._doc.data.includes(refreshToken)) {
          res.status(201).json({ accessToken, refreshToken });
        }
        // refreshTokens.push(refreshToken);
        //Step 5 : Sending refresh and access token to client.
      } else {
        res.status(401).json({ message: "The passwords do not match." });
      }
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ message: "Error occured while verifying tokens." });
    }
  }
});

// GENERATES THE REFRESH & ACCESS TOKENS FOR TUTOR
//=================================================
router.post("/tutor-login", async (req, res) => {
  // Retrieving user credentials from our database.
  let tutorData = await Student.findOne({ firstName: req.body.FirstName });
  console.log("Tutor Found :-");
  console.log(tutorData);
  if (tutorData == null) {
    res.status(401).json({ message: "User not found" });
  } else {
    const { firstName, lastName, role, password } = tutorData;
    // Step 2 : Comparing passwords using bcrypt compare function.
    try {
      if (await bcrypt.compare(req.body.password, password)) {
        // Step 2 : Generating User Payload, if the user is valid.
        const user = { firstName, lastName, role }; //Our payload.
        // Step 3 : Generating the access & refresh tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        //Step 4 : Saving a copy of the refresh token to our database.
        let { _id: tokenID } = await RefreshToken.findOne({ name: "tokens" }); //Taking the ID of C Lesson
        let refreshTokenData = await RefreshToken.findByIdAndUpdate(
          tokenID,
          { $push: { data: refreshToken } },
          { new: true, useFindAndModify: false, runValidation: true }
        );
        if (refreshTokenData._doc.data.includes(refreshToken)) {
          res.status(201).json({ accessToken, refreshToken });
        }
        // refreshTokens.push(refreshToken);
        //Step 5 : Sending refresh and access token to client.
      } else {
        res.status(401).json({ message: "The passwords do not match." });
      }
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ message: "Error occured while verifying tokens." });
    }
  }
});

// RENEWS THE ACCESS TOKENS BASED ON THE REFRESH TOKEN
//=======================================================
router.post("/refresh-token", async (req, res) => {
  const refreshToken = req.body.refreshToken;
  //   Trap 1 : Checks if the refresh token is a bluff/empty.
  if (refreshToken == null) {
    return res.status(401).json({ message: "No refresh token received." });
  }
  // Trap 2 : Compares the refresh tokens

  let refreshTokens = await RefreshToken.findOne({ name: "tokens" });
  if (!refreshTokens.data.includes(refreshToken)) {
    return res
      .status(403)
      .json({ message: "Refresh token has not been found." });
  }
  // We need to delete the previous refresh token for security reasons.
  //   Trap 3 : Regenerates our short term access token (Its all about verifying payload and extracting info
  // again to be used in the regeneration of the access token.)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).json({
        message:
          "We have your refresh token but somehow we are encountering some issues.",
      });
    } else {
      const { firstName, lastName, role } = payload;
      const userData = { firstName, lastName, role };
      const accessToken = generateAccessToken(userData);
      const refreshToken = generateRefreshToken(userData);
      res.status(201).json({ accessToken, refreshToken });
    }
  });
});

// DELETES THE REFRESH TOKENS IN OUR DATABASE.
//=============================================
router.delete("/logout", async (req, res) => {
  let refreshTokens = await RefreshToken.findOne({ name: "tokens" });

  if (!refreshTokens.data.includes(req.body.token)) {
    return res
      .status(403)
      .json({ message: "Refresh token not found for deletion." });
  } else {
    refreshTokens = refreshTokens.data.filter(
      (token) => token !== req.body.token
    );
    refreshTokens.save();
    res.status(204).json({ message: "Refresh token deleted successfully." });
  }
});

module.exports = router;
