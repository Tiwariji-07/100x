const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
// const ObjectId = Schema.ObjectId;

const Admin = new Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
});

module.exports = mongoose.model("admin", Admin);
