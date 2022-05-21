const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: { type: String, unique: true, required: true, min: 6, max: 255 },
  fName: { type: String },
  lName: { type: String },
  email: { type: String, unique: true, required: true, min: 5, max: 255 },
  password: { type: String, required: true, min: 6, max: 255 },
  date: { type: String },
  userId: { type: String },
});

module.exports = mongoose.model("User", UserSchema);
