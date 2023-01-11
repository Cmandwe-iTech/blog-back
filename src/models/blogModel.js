const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blog_schema = new Schema({
  file: { type: String },
  title: { type: String },
  description: { type: String },
  user: { type: String, ref: "register" },
});

const BlogModel = mongoose.model("BlogModel", blog_schema);
module.exports = BlogModel;
