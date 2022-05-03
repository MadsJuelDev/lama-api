const { boolean } = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let NextWeekSchema = new Schema({
  archived: { type: Boolean },
  date: { type: String },
  projectId: { type: String },
  task: { type: String },
  userId: { type: String },
});

module.exports = mongoose.model("NextWeek", NextWeekSchema);
