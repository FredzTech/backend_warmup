if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// MODELS SECTION
const Student = require("../models/StudentModel");
const Tutor = require("../models/TutorModel");
const Admin = require("../models/AdminModel");
const RefreshToken = require("../models/RefreshTokensModel");

// AUTHORIZATION SECTION
//=======================
const generateAccessToken = (userData) => {
  return jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "5m", //Usually shorter for sercurity reasons.
  });
};
const generateRefreshToken = (userData) => {
  return jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "10m", //Should have a longer expiration time.
  });
};
const authenticateToken = (req, res, next) => {
  // Destructures & Returns payload if comparison is successfull
  const authHeader = req.headers[`authorization`];
  const token = authHeader && authHeader.split(" ")[1]; //
  console.log(`Auth Token ${token}`);
  if (token == null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      //BREAKING DOWN THE ERRORS FURTHER.
      if (err.name == "TokenExpiredError") {
        // We automatically request for a new access token & refresh token.
        console.log(`${JSON.stringify(err)}`);
        return res.status(403).send(err.message);
      } else if (err.name == "JsonWebTokenError") {
        res.status(403).send(err.message);
      }
    }
    req.user = payload; //Tunaskuma the payload data into the user object if we can prove that the data has not been altered,
    next();
  });
};
const createTokenModel = async (req, res) => {
  try {
    // let { adminId } = req.params;
    const data = {
      name: "tokens",
      data: ["Hello"],
    };
    let tokenData = await RefreshToken.create(data);
    res.status(200).json(tokenData);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
const renewTokens = async (req, res) => {
  const refreshToken = req.body.refreshToken;
  //   Trap 1 : Checks if the refresh token is a bluff/empty.
  if (refreshToken == null) {
    return res.sendStatus(401);
  }
  // Trap 2 : Compares the refresh tokens

  let refreshTokens = await RefreshToken.findOne({ name: "tokens" });
  if (!refreshTokens.data.includes(refreshToken)) {
    return res.sendStatus(403);
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
      // We destructure to sieve only the info that we require.
      const { firstName, surname, role } = payload;
      const userData = { firstName, surname, role };
      const accessToken = generateAccessToken(userData);
      res.json({ accessToken, refreshToken });
    }
  });
};

// REGISTRATION SECTION
const registerStudent = async (req, res) => {
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
};
const registerTutor = async (req, res) => {
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
    const tutor = await Tutor.create(credentials);
    tutor.save();
    res.sendStatus(201);
  } catch (error) {
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
};
const registerAdmin = async (req, res) => {
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
    const tutor = await Admin.create(credentials);
    tutor.save();
    res.sendStatus(201);
  } catch (err) {
    if (err.code == 11000) {
      res.sendStatus(409);
    } else {
      console.log(err);
      let { _message, name } = err;
      let errorBody = { _message, name };
      res.status(400).json(errorBody);
    }
  }
};

// LOGIN SECTION
const logInUser = async (req, res) => {
  // Retrieving user credentials from our database and redirecting accordingly according to role received.
  console.log(req.body);
  let studentData = await Student.findOne({ firstName: req.body.firstName });
  console.log(studentData);
  if (studentData !== null) {
    const { firstName, surname, role, password } = studentData;
    try {
      if (await bcrypt.compare(req.body.password, password)) {
        const user = { firstName, surname, role }; //Our payload.
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        let { _id: tokenID } = await RefreshToken.findOne({ name: "tokens" });
        let refreshTokenData = await RefreshToken.findByIdAndUpdate(
          tokenID,
          { $push: { data: refreshToken } },
          { new: true, useFindAndModify: false, runValidation: true }
        );
        if (refreshTokenData._doc.data.includes(refreshToken)) {
          res.status(200).json({
            accessToken,
            refreshToken,
            user: { firstName: user.firstName, surname: user.surname },
            roles: [user.role],
          });
        }
      } else {
        res
          .status(401)
          .json({ message: "The students passwords do not match." });
      }
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ message: "Error occured while verifying students tokens" });
    }
  } else if (studentData === null) {
    console.log("Not a student.");

    // We look for whether he/ she is a tutor.
    let tutorData = await Tutor.findOne({ firstName: req.body.firstName });
    if (tutorData !== null) {
      const { firstName, surname, role, password } = tutorData;
      try {
        if (await bcrypt.compare(req.body.password, password)) {
          const user = { firstName, surname, role };
          const accessToken = generateAccessToken(user);
          const refreshToken = generateRefreshToken(user);
          console.log(user);
          let { _id: tokenID } = await RefreshToken.findOne({ name: "tokens" });
          let data = await RefreshToken.findOne({
            name: "tokens",
          });

          console.log(data);

          let refreshTokenData = await RefreshToken.findByIdAndUpdate(
            tokenID,
            { $push: { data: refreshToken } },
            { new: true, useFindAndModify: false, runValidation: true }
          );
          if (refreshTokenData._doc.data.includes(refreshToken)) {
            res.status(200).json({
              accessToken,
              refreshToken,
              user: { firstName: user.firstName, surname: user.surname },
              roles: [user.role],
            });
          }
        } else {
          res
            .status(401)
            .json({ message: "The tutor passwords do not match." });
        }
      } catch (err) {
        console.log(err);
        res
          .status(500)
          .json({ message: "Error occured while verifying tokens tutor" });
      }
    } else if (tutorData == null) {
      console.log("Admin verification");
      let adminData = await Admin.findOne({ firstName: req.body.firstName });
      console.log(adminData);
      if (adminData !== null) {
        const { firstName, surname, role, password } = adminData;
        // Step 2 : Comparing passwords using bcrypt compare function.
        try {
          if (await bcrypt.compare(req.body.password, password)) {
            const user = { firstName, surname, role };
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
            let { _id: tokenID } = await RefreshToken.findOne({
              name: "tokens",
            });
            let refreshTokenData = await RefreshToken.findByIdAndUpdate(
              tokenID,
              { $push: { data: refreshToken } },
              { new: true, useFindAndModify: false, runValidation: true }
            );
            if (refreshTokenData._doc.data.includes(refreshToken)) {
              res.status(200).json({
                accessToken,
                refreshToken,
                user: { firstName: user.firstName, surname: user.surname },
                roles: [user.role],
              });
            }
            //Step 5 : Sending refresh and access token to client.
          } else {
            res
              .status(401)
              .json({ message: "The admin passwords do not match." });
          }
        } catch (err) {
          console.log(err);
          res
            .status(500)
            .json({ message: "Error occured while verifying tokens admin" });
        }
      } else {
        console.log("Bad request response sent.");
        res.sendStatus(400);
      }
    }
  }
};

const logOutUser = async (req, res) => {
  // Deletes refresh tokens from our DB
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
    res.sendStatus(204);
  }
};

// TUTOR SECTION
const findTutorById = async (req, res) => {
  try {
    let { tutorId } = req.params;
    let tutorData = await Tutor.findById(tutorId);
    res.status(200).json(tutorData);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
const findAllTutors = async (req, res) => {
  try {
    const tutorData = await Tutor.find({});
    res.status(200).json(tutorData);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
const deleteTutorById = async (req, res) => {
  try {
    await Tutor.findByIdAndDelete(req.body._id, function (err, docs) {
      if (!err) {
        console.log(docs);
        res.status(200).json(docs);
      } else {
        console.log(err);
        res.status(400).send(err);
      }
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

// ADMIN SECTION
const findAllAdmins = async (req, res) => {
  try {
    const adminData = await Admin.find({});
    res.status(200).json(adminData);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

const findAdminById = async (req, res) => {
  try {
    let { adminId } = req.params;
    let adminData = await Admin.findById(adminId);
    res.status(200).json(adminData);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const deleteAdminById = async (req, res) => {
  try {
    await Admin.findByIdAndDelete(req.body._id, function (err, docs) {
      if (!err) {
        console.log(docs);
        res.status(200).json(docs);
      } else {
        console.log(err);
        res.status(400).send(err);
      }
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

// STUDENT SECTION
const findStudentById = async (req, res) => {
  try {
    let { studentId } = req.params;
    let studentData = await Student.findById(studentId);
    res.status(200).json(studentData);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const findAllStudents = async (req, res) => {
  try {
    const studentData = await Student.find({});
    res.status(200).json(studentData);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

const deleteStudentById = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.body._id, function (err, docs) {
      if (!err) {
        console.log(docs);
        res.status(200).json(docs);
      } else {
        console.log(err);
        res.status(400).send(err);
      }
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

// STUDENT SECTION
//=================
module.exports = {
  createTokenModel,
  renewTokens,
  authenticateToken,
  findStudentById,
  findAllStudents,
  registerStudent,
  deleteStudentById,
  findTutorById,
  findAllTutors,
  registerTutor,
  deleteTutorById,
  findAdminById,
  findAllAdmins,
  registerAdmin,
  deleteAdminById,
  logInUser,
  logOutUser,
};
