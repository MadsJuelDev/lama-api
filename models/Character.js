const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let CharacterSchema = new Schema({
  hair: { type: String }, // hari URL
  top: { type: String }, // top URL
  bottom: { type: String }, // bottom URL
  shoe: { type: String }, // shoe URL
  createdBy: { type: String }, //userId from creator
});

module.exports = mongoose.model("Character", CharacterSchema);
