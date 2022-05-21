const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let ProjectsSchema = new Schema({
  name: { type: String, required: true, min: 1 },
  projectId: { type: String, required: true },
  userId: { type: String, required: true },
  collabIdOne: { type: String },
  collabIdTwo: { type: String },
  collabIdThree: { type: String },
  collabIdFour: { type: String },
});

module.exports = mongoose.model("Projects", ProjectsSchema);
