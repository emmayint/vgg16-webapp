let express = require("express");
let router = express.Router();
let multer = require("multer");
let path = require("path");
var fs = require("fs");
// const db = require('../database/db');

global.projectName;
var projectName;
var selectedCategory = "";
var selectedDir = "";
var hasTestDir = false;
var trainfiles = [];

// Setting up upload function using multer
let uploadTrain = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, selectedDir);
    },
    filename: (req, file, cb) => {
      console.log(file.originalname);
      cb(null, path.basename(file.originalname));
    }
  })
});

router.post("/createFile", uploadTrain.array("file", 40), function(req, res) {
  res.redirect("/upload");
});

// Add middleware to the route
router.get("/", function(req, res) {
  // display all categories in current project
  let allProjectBuf = Buffer.from("./allProjects");
  fs.readdir(allProjectBuf, (err, projects) => {
    // get all exixting projects
    if (err) {
      console.log(err.message);
    } else {
      if (projectName) {
        // when a project is selected
        let projectBuf = Buffer.from("./allProjects/" + projectName);
        fs.readdir(projectBuf, (err, files) => {
          if (err) {
            console.log(err.message);
          } else {
            if (files.includes("testData")) {
              hasTestDir = true;
            } else {
              hasTestDir = false;
            }
          }
        });
        // if a project is created or selected, show all categories under its datasets
        let dirBuf = Buffer.from("./allProjects/" + projectName + "/datasets");
        fs.readdir(dirBuf, (err, files) => {
          if (err) {
            console.log(err.message);
          } else {
            trainfiles = files;
            console.log(
              "selectedCategory:",
              selectedCategory,
              " trainfiles: ",
              trainfiles
            );
            res.render("upload", {
              projects: projects,
              selectedCategory: selectedCategory,
              // files: files,
              trainfiles: trainfiles,
              projectName: projectName,
              // selectedDir: selectedDir,
              hasTestDir: hasTestDir
            });
          }
        });
      } else {
        res.render("upload", {
          projects: projects,
          selectedCategory: selectedCategory,
          // files: [],
          trainfiles: trainfiles,
          projectName: projectName,
          // selectedDir: selectedDir,
          hasTestDir: hasTestDir
        });
      }
    }
  });
});

router.post("/nameProject", function(req, res) {
  console.log("post /nameProject with body:", req.body);
  projectName = req.body.projectName;
  global.projectName = projectName;

  console.log("projectName: ", projectName);

  if (!fs.existsSync("./allProjects/" + projectName + "/datasets")) {
    fs.mkdirSync("./allProjects/" + projectName + "/datasets", {
      recursive: true
    });
  }

  res.redirect("/upload");
});

router.post("/createDir", function(req, res) {
  console.log("post /createDir, ", "body:", req.body);
  category = req.body.category;
  console.log(
    "creating dir: ",
    "./allProjects/" + projectName + "/datasets/" + category
  );

  if (
    !fs.existsSync("./allProjects/" + projectName + "/datasets/" + category)
  ) {
    fs.mkdirSync("./allProjects/" + projectName + "/datasets/" + category, {
      recursive: true
    });
  }
  res.redirect("/upload");
});

router.post("/selectDir", function(req, res) {
  console.log("post /createDir, ", "body:", req.body);
  selectedCategory = req.body.category;
  selectedDir =
    "./allProjects/" + projectName + "/datasets/" + selectedCategory;
  res.redirect("/upload");
});

router.post("/selectProject", function(req, res) {
  console.log("post /selectProject with body:", req.body);
  projectName = req.body.projectName;
  global.projectName = projectName;

  // TODO check and set value for hasTestDir
  res.redirect("/upload");
});

// pop up window
// router.get("/createFile", function(req, res) {
//   console.log("get /createFile,", "selectedDir:", selectedDir);
//   res.render("createFile", { selectedDir: selectedDir });
// });

router.post("/createTestDir", function(req, res) {
  console.log("post /createTestDir, ", "body:", req.body);
  console.log("creating dir: ", "./allProjects/" + projectName + "/testData");

  if (!fs.existsSync("./allProjects/" + projectName + "/testData")) {
    fs.mkdirSync("./allProjects/" + projectName + "/testData", {
      recursive: true
    });
  }
  hasTestDir = true;

  let dirBuf = Buffer.from("./allProjects/" + projectName + "/datasets");
  fs.readdir(dirBuf, (err, files) => {
    if (err) {
      console.log(err.message);
    } else {
      // propagate all categories in datasets(train) to testData
      files.forEach(function(file) {
        if (
          !fs.existsSync("./allProjects/" + projectName + "/testData/" + file)
        ) {
          fs.mkdirSync("./allProjects/" + projectName + "/testData/" + file, {
            recursive: true
          });
        }
      });
    }
  });
  res.redirect("/upload");
});

module.exports = router;
