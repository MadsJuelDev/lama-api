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

//validating task
const taskValidation = (data) => {
  const schema = Joi.object({
    isCollapsed: Joi.boolean(),
    description: Joi.string().min(0),
    urgency: Joi.string().min(0),
    status: Joi.string().min(0),
    task: Joi.string().min(1).max(255).required(),
  });
  return schema.validate(data);
};

//move task validation
const taskMoveValidation = (data) => {
  const schema = Joi.object({
    status: Joi.string().min(0),
  });
  return schema.validate(data);
};

//archive task validation
const taskArchiveValidation = (data) => {
  const schema = Joi.object({
    archived: Joi.boolean(),
  });
  return schema.validate(data);
};

//archive task validation
const taskCollapseValidation = (data) => {
  const schema = Joi.object({
    isCollapsed: Joi.boolean(),
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
module.exports = {
  taskValidation,
  taskMoveValidation,
  taskArchiveValidation,
  taskCollapseValidation,
  registerValidation,
  loginValidation,
  validateToken,
};
