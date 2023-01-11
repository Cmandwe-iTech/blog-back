const express = require("express");
const blogrouter = express.Router();
const BlogModel = require("../models/blogModel");

blogrouter.post("/posts", async (req, res) => {
  try {
    const user = await BlogModel.create({
      file: req.body.file,
      title: req.body.title,
      description: req.body.description,
      user: req.user
    });

    res.status(200).json({
      status: "success",
      user,
    });
  } catch (e) {
    res.status(400).json({
      status: "failed",
      message: e.message,
    });
  }
});

blogrouter.get("/posts", async (req, res) => {
  try {
    const user = await BlogModel.find({ user: req.user });
    if (user.length) {
      res.status(200).json({
        status: "success",
        user,
      });
    } else {
      res.status(404).json({
        status: "failed",
        message: "page not found",
      });
    }
  } catch (e) {
    res.status(401).json({
      status: "failed",
      message: e.message,
    });
  }
});

module.exports = blogrouter;
