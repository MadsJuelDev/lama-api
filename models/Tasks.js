const { boolean } = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let TaskSchema = new Schema({
  archived: { type: Boolean },
  isCollapsed: { type: Boolean },
  date: { type: String },
  description: { type: String },
  urgency: { type: String },
  status: { type: String },
  projectId: { type: String },
  task: { type: String, required: true },
  userId: { type: String, required: true },
});

module.exports = mongoose.model("Tasks", TaskSchema);
