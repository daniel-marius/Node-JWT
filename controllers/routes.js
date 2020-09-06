const User = require("../models/User");

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { success, error, validation } = require("../uitls/responseAPI");

const { registerValidation, loginValidation } = require("../utils/validation");
const {
  arrayToObjectConversion,
  arrayToObjectConversion2
} = require("../utils/arrayToObject");

// @desc    Get all posts
// @route   GET /api/user/posts
// @access  Protected route by jwt
exports.getPosts = async (req, res, next) => {
  // return res.status(200).json({
  //   success: true,
  //   posts: { title: "Title", description: "Description" }
  // });
  return res
    .status(200)
    .json(
      success(
        "Ok",
        { title: "Title", description: "Description" },
        res.statusCode
      )
    );
};

// @desc    Register new user
// @route   POST /api/user/register
// @access  Public
exports.registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  // Check if user credentials exist
  const { error } = registerValidation(req.body);

  if (error) {
    // return res.status(400).json({
    //   success: false,
    //   error: error.details[0].message
    // });
    return res
      .status(422)
      .json(validation({ registration: error.details[0].message }));
  }

  try {
    // Check if the email is already in the database
    const emailExists = await User.findOne({ email }).exec();

    if (emailExists) {
      // return res.status(400).json({
      //   success: false,
      //   error: "Email already exists!"
      // });
      return res
        .status(400)
        .json(error("Email already exists!", res.statusCode));
    }
  } catch (error) {
    // return res.status(500).json({
    //   success: false,
    //   error: "Internal Server Error!"
    // });
    return res
      .status(500)
      .json(error("Internal Server Error!", res.statusCode));
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const userPassword = req.body.password;
  const hashPassword = await bcrypt.hash(userPassword, salt);

  // Create new user
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    email: req.body.email,
    password: hashPassword
  });

  try {
    const newUser = await user.save();

    // return res.status(201).json({
    //   success: true,
    //   data: newUser
    // });
    return res
      .status(201)
      .json(success("User Created!", { data: newUser }, res.statusCode));
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(val => val.message);
      // return res.status(400).json({
      //   success: false,
      //   error: messages
      // });
      return res.status(422).json(validation({ messages }));
    } else {
      // return res.status(500).json({
      //   success: false,
      //   error: "Internal Server Error!"
      // });
      return res
        .status(500)
        .json(error("Internal Server Error!", res.statusCode));
    }
  }
};

// @desc    Verify user credentials and create new jwt
// @route   POST /api/user/login
// @access  Public
exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  // Check of user credentials exist
  const { error } = loginValidation(req.body);

  if (error) {
    // return res.status(400).json({
    //   success: false,
    //   error: error.details[0].message
    // });
    return res
      .status(422)
      .json(validation({ login: error.details[0].message }));
  }

  try {
    // Check if the email is already in the database
    const user = await User.findOne({ email }).exec();
    if (!user) {
      // return res.status(400).json({
      //   success: false,
      //   error: "Email does not exist!"
      // });
      return res
        .status(404)
        .json(error("Email does not exist!", res.statusCode));
    }

    // Verify hashPassword
    const currentPassword = password;
    const passwordToBeCompared = user.password;
    const verifyPass = await bcrypt.compare(
      currentPassword,
      passwordToBeCompared
    );

    if (!verifyPass) {
      // return res.status(400).json({
      //   success: false,
      //   error: "Invalid password!"
      // });
      return res
        .status(422)
        .json(validation({ password: "Invalid Password!" }));
    }

    // Create and sign a token
    const signParams = { _id: user._id }; // more params can be added
    const jwtSecret = process.env.JWT_SECRET;
    const otherParams = { expiresIn: "1h" };
    const token = jwt.sign(signParams, jwtSecret, otherParams);

    // res.header("auth-token").send(token);

    // return res.status(200).json({
    //   success: true,
    //   data: token
    // });
    return res
      .status(201)
      .json(success("Token Created!", { data: token }, res.statusCode));
  } catch (error) {
    // return res.status(500).json({
    //   success: false,
    //   error: "Internal Server Error!"
    // });
    return res
      .status(500)
      .json(error("Internal Server Error!", res.statusCode));
  }
};

// @desc    Get user by id
// @route   GET /api/user/:userId
// @access  Public
exports.getUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const getUser = await User.findById({ _id: userId })
      .select("_id name email")
      .exec();

    // return res.status(200).json({
    //   success: true,
    //   data: getUser
    // });
    return res
      .status(200)
      .json(success("User Fetched!", { data: getUser }, res.statusCode));
  } catch (err) {
    if (err.name === "CastError") {
      // return res.status(400).json({
      //   success: false,
      //   error: err.message
      // });
      return res.status(400).json(error(err.message, res.statusCode));
    } else {
      // return res.status(500).json({
      //   success: false,
      //   error: "Internal Server Error!"
      // });
      return res
        .status(500)
        .json(error("Internal Server Error!", res.statusCode));
    }
  }
};

// @desc    Update user by id
// @route   PATCH /api/user/:userId
// @access  Public
exports.updateUser = async (req, res, next) => {
  const { userId } = req.params;

  // Convert request body to JavaScript Object
  const updatedBody = arrayToObjectConversion2(req.body);

  try {
    const updatedUser = await User.updateOne(
      { _id: userId },
      { $set: updatedBody }
    ).exec();

    // return res.status(200).json({
    //   success: true,
    //   data: updatedUser
    // });
    return res
      .status(200)
      .json(success("User Updated!", { data: updatedUser }, res.statusCode));
  } catch (err) {
    if (err.name === "CastError") {
      // return res.status(400).json({
      //   success: false,
      //   error: err.message
      // });
      return res.status(400).json(error(err.message, res.statusCode));
    } else {
      // return res.status(500).json({
      //   success: false,
      //   error: "Internal Server Error!"
      // });
      return res
        .status(500)
        .json(error("Internal Server Error!", res.statusCode));
    }
  }
};

// @desc    Delete user by id
// @route   DELETE /api/v1/transactions
// @access  Public
exports.deleteUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const deletedUser = await User.deleteOne({ _id: userId }).exec();

    // return res.status(200).json({
    //   success: true,
    //   data: deletedUser
    // });
    return res
      .status(200)
      .json(success("User Deleted!", { data: deletedUser }, res.statusCode));
  } catch (err) {
    if (err.name === "CastError") {
      // return res.status(400).json({
      //   success: false,
      //   error: err.message
      // });
      return res.status(400).json(error(err.message, res.statusCode));
    } else {
      // return res.status(500).json({
      //   success: false,
      //   error: "Internal Server Error!"
      // });
      return res
        .status(500)
        .json(error("Internal Server Error!", res.statusCode));
    }
  }
};
