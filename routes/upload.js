let express = require("express");
let router = express.Router();
let multer = require("multer");
let path = require("path");
var fs = require("fs");
// const db = require('../database/db');

var projectName;
var uploadDir = "";
var category = "";
var datasetsDir = "";
var selectedDir = "";
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
  if (datasetsDir != "") {
    let dirBuf = Buffer.from(datasetsDir);
    fs.readdir(dirBuf, (err, files) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log("category:", category, "files", files);
        res.render("upload", {
          category: category,
          files: files,
          projectName: projectName,
          selectedDir: selectedDir
        });
      }
    });
  } else {
    res.render("upload", {
      category: category,
      files: [],
      projectName: projectName,
      selectedDir: selectedDir
    });
  }
});

router.post("/nameProject", function(req, res) {
  console.log("post /nameProject, ", "body:", req.body);
  projectName = req.body.projectName;
  datasetsDir = "./" + projectName + "/datasets";
  console.log("datasetsDir: ", datasetsDir);
  if (!fs.existsSync(datasetsDir)) {
    fs.mkdirSync(datasetsDir, { recursive: true });
  }
  res.redirect("/upload");
});

router.post("/createDir", function(req, res) {
  console.log("post /createDir, ", "body:", req.body);
  category = req.body.category;
  uploadDir = datasetsDir + "/" + category;
  console.log("uploadDir: ", uploadDir);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  res.redirect("/upload");
});

router.post("/selectDir", function(req, res) {
  console.log("post /createDir, ", "body:", req.body);
  category = req.body.category;
  selectedDir = datasetsDir + "/" + category;
  res.redirect("/upload");
});

router.post("/createFile", uploadTrain.array("file", 40), function(req, res) {
  res.redirect("/upload");
});

// pop up window
router.get("/createFile", function(req, res) {
  console.log("get /createFile,", "selectedDir:", selectedDir);
  res.render("createFile", { selectedDir: selectedDir });
});

module.exports = router;
