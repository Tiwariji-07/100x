const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const Course = new Schema({
  title: String,
  description: String,
  price: Number,
  imageUrl: String,
  creatorId: { type: ObjectId, ref: "admin" },
});

module.exports = mongoose.model("course", Course);
