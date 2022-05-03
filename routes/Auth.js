const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { registerValidation, loginValidation } = require("../validation");

// /registration
router.post("/register", async (req, res) => {
  //validate user input (name, email, password)
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  //check if email already exists
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).json({ error: "Email already exists" });
  }

  //hash the password
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  //create user object and save to DB
  const userObject = new User({
    name: req.body.name,
    email: req.body.email,
    password,
  });
  try {
    const savedUser = await userObject.save();
    res.json({ error: null, data: savedUser._id });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get("/", (req, res) => {
  User.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

// /login
router.post("/login", async (req, res) => {
  //validate user login info
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  //if info is valid find user
  const user = await User.findOne({ email: req.body.email });

  //Throw error if email is wrong
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
      name: user.name,
      id: user._id,
    },
    //TOKEN_SECRET
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
    //Expiration time
  );
  const username = user.name;
  const userID = user._id;
  //attach authentication token to header
  res.header("auth-token", token).json({
    error: null,
    data: { token },
  });
});

module.exports = router;
