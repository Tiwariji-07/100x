const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
// const ObjectId = Schema.ObjectId;
const Purchase = new Schema({
  courseId: { type: ObjectId, ref: "course" },
  userId: { type: ObjectId, ref: "user" },
});

module.exports = mongoose.model("purchase", Purchase);
