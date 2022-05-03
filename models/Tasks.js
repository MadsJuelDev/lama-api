const { boolean } = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let TaskSchema = new Schema({
  archived: { type: Boolean },
  date: { type: String },
  projectId: { type: String },
  task: { type: String },
  userId: { type: String },
});

module.exports = mongoose.model("Tasks", TaskSchema);
