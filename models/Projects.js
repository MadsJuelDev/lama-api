const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let ProjectsSchema = new Schema({
  name: { type: String, required: true },
  projectId: { type: String, required: true },
  userId: { type: String, required: true },
});

module.exports = mongoose.model("Projects", ProjectsSchema);
