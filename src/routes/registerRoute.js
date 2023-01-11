const express = require("express");
const reg_router = express.Router();
const registerData = require("../models/registerModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

reg_router.post("/register", async (req, res) => {
  try {
    const isAvailable = await registerData.findOne({ email: req.body.email });

    if (isAvailable) {
      res.json({
        status: "failed",
        message: "user already exists",
      });
    } else {
      if (req.body.password === req.body.confirmpassword) {
        bcrypt.hash(req.body.password, 10, async function (err, hash) {
          if (!err) {
            try {
              const user = await registerData.create({
                email: req.body.email,
                password: hash,
              });
              res.json({
                status: "succes",
                user,
              });
            } catch (e) {
              res.status(401).json({
                status: "failed",
                message: e.message,
              });
            }
          }
        });
      } else {
        res.status(401).json({
          status: "failed",
          message: "password missmatch",
        });
      }
    }
  } catch (e) {
    res.status(401).json({
      status: "failed",
      message: e.message,
    });
  }
});

reg_router.post("/login", async (req, res) => {
  try {
    const user = await registerData.findOne({ email: req.body.email });
    if (user) {
      let result = bcrypt.compare(req.body.password, user.password);
      if (result) {
        const token = jwt.sign(
          {
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
            data: user._id,
          },
          "secret"
        );
        res.status(200).json({
          status: "ok",
          token,
        });
      } else {
        res.status(404).json({
          status: "failed",
          message: "password does not match",
        });
      }
    } else {
      res.status(404).json({
        status: "failed",
        message: "user does not available",
      });
    }
  } catch (e) {
    res.status(400).json({
      status: "failed",
      message: e.message,
    });
  }
});

module.exports = reg_router;
