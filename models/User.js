const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: { type: String },
  fName: { type: String },
  lName: { type: String },
  email: { type: String },
  password: { type: String },
  date: { type: String },
  userId: { type: String },
});

module.exports = mongoose.model("User", UserSchema);
