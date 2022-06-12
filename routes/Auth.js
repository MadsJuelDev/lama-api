const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");

let currentDate = moment().format("DD/MM/YYYY");
const { registerValidation, loginValidation } = require("../validation");

// Registers a User - post
router.post("/register", async (req, res) => {
  //validate user input (username, email, password)
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  //check if email already exists
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).json({ error: "Email already exists" });
  }

  //check if username already exists
  const userNameExist = await User.findOne({ username: req.body.username });
  if (userNameExist) {
    return res.status(418).json({ error: "Username already exists" });
  }

  //hash the password
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  //create user object and save to DB
  const userObject = new User({
    username: req.body.username,
    fName: "",
    lName: "",
    email: req.body.email,
    password,
    date: currentDate,
    userId: req.body.username,
  });
  try {
    const savedUser = await userObject.save();
    res.json({ error: null, data: savedUser._id });
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Logs In the User - post
router.post("/login", async (req, res) => {
  //validate user login info
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(418).json({ error: error.details[0].message });
  }

  //if info is valid find user
  const user = await User.findOne({ username: req.body.username });

  //Throw error if username is wrong
  if (!user) {
    return res.status(400).json({ error: "User does not exist" });
  }

  //user exists check for password correctness
  const validPassword = await bcrypt.compare(req.body.password, user.password);

  //throw error if password is wrong
  if (!validPassword) {
    return res.status(400).json({ error: "Password is wrong" });
  }

  //create authentication token
  const token = jwt.sign(
    {
      //payload
      username: user.username,
      email: user.email,
    },
    //TOKEN_SECRET
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
    //Expiration time
  );
  //attach authentication token to header
  res.header("auth-token", token).json({
    error: null,
    data: { token },
  });
});

module.exports = router;
