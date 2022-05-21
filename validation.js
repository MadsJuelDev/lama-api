const Joi = require("joi");
const jwt = require("jsonwebtoken");

//validating registration
const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(6).max(255).required(),
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().min(6).max(255).required(),
  });
  return schema.validate(data);
};
//validating login
const loginValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(6).max(255).required(),
    password: Joi.string().min(6).max(255).required(),
  });
  return schema.validate(data);
};

//logic to verify token (JWT)
const validateToken = (req, res, next) => {
  const token = req.header("authtoken");
  if (!token) return res.status(401).json({ error: "Access Denied" });
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: "Token is not valid" });
  }
};
module.exports = { registerValidation, loginValidation, validateToken };
