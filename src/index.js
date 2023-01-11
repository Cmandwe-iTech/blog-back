const express = require("express");
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const reg_router = require("./routes/registerRoute");
const blogrouter = require("./routes/blogRoute");
const port = process.env.PORT || 4000;

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.DATABASE_URL, () => {
  console.log("connected to databases");
});

app.use("/posts", (req, res, next) => {
  try {
    console.log(req.headers);
    const token = req.headers.authorization;
    console.log(token);
    if (token) {
      const decoded = jwt.verify(token, "secret");
      //console.log(decoded);
      req.user = decoded.data;
      next();
    } else {
      res.status(401).json({
        status: "failed",
        message: "token are missing",
      });
    }
  } catch (e) {
    res.status(401).json({ 
      status: "failed",
      message: e.message,
    });
  }
});

app.use("/", reg_router);
app.use("/", blogrouter);

app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
