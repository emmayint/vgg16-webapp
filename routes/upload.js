let express = require("express");
let router = express.Router();
let multer = require("multer");
let path = require("path");
var fs = require("fs");
// const db = require('../database/db');

var uploadDir = "";
var category = "";

// Setting up upload function using multer
let uploadTrain = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      console.log(file.originalname);
      cb(null, path.basename(file.originalname));
    }
  })
});

// Add middleware to the route
router.get("/", function(req, res) {
  let datasets = "datasets/train";
  let dirBuf = Buffer.from(datasets);
  fs.readdir(dirBuf, (err, files) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("category:", category, "files", files);
      res.render("upload", { category: category, files: files });
    }
  });
});

router.post("/createDir", function(req, res) {
  console.log("body:", req.body);
  category = req.body.category;
  uploadDir = "./datasets/train/" + category;
  console.log("will upload to ", uploadDir);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  let datasets = "datasets/train";
  let dirBuf = Buffer.from(datasets);
  fs.readdir(dirBuf, (err, files) => {
    if (err) {
      console.log(err.message);
    } else {
      res.redirect("/upload");
      // res.render("upload", { files: files, category: category });
    }
  });
});

router.post("/createFile", uploadTrain.array("file", 40), function(req, res) {
  let datasets = "datasets/train";
  let dirBuf = Buffer.from(datasets);
  fs.readdir(dirBuf, (err, files) => {
    if (err) {
      console.log(err.message);
    } else {
      res.redirect("/upload");
      // res.render("upload", { files: files, category: category });
    }
  });
});

router.get("/createFile", function(req, res) {
  console.log("uploadDir:", uploadDir);
  res.render("createFile", { uploadDir: uploadDir });
});

module.exports = router;
