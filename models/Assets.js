const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let AssetsSchema = new Schema({
  name: { type: String }, // Hair Style One
  number: { type: String }, // 1 2 3 ... 10
  type: { type: String }, // Hair, Bottom, Top, Shoes
  color: { type: String }, // Black, green and so on
  style: { type: String }, // Long Hair, Short Hair, Skirt, High heels
  assetUrl: { type: String }, // ../../assets/hari.png
});

module.exports = mongoose.model("Assets", AssetsSchema);
