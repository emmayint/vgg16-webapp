let express = require("express");
let router = express.Router();
let multer = require("multer");
let path = require("path");
var fs = require("fs");
// const db = require('../database/db');

var projectName;
var category = "";
var selectedDir = "";

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
  let allProjectBuf = Buffer.from("./allProjects"); // get all projects
  fs.readdir(allProjectBuf, (err, projects) => {
    if (err) {
      console.log(err.message);
    } else {
      if (projectName) {
        // if a project is created or selected, show all categories under its datasets
        let dirBuf = Buffer.from("./allProjects/" + projectName + "/datasets");
        fs.readdir(dirBuf, (err, files) => {
          if (err) {
            console.log(err.message);
          } else {
            console.log("category:", category, "files", files);
            res.render("upload", {
              projects: projects,
              category: category,
              files: files,
              projectName: projectName,
              selectedDir: selectedDir
            });
          }
        });
      } else {
        res.render("upload", {
          projects: projects,
          category: category,
          files: [],
          projectName: projectName,
          selectedDir: selectedDir
        });
      }
    }
  });
});

router.post("/nameProject", function(req, res) {
  console.log("post /nameProject with body:", req.body);
  projectName = req.body.projectName;
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
  category = req.body.category;
  selectedDir = "./allProjects/" + projectName + "/datasets/" + category;
  res.redirect("/upload");
});

router.post("/selectProject", function(req, res) {
  console.log("post /selectProject with body:", req.body);
  projectName = req.body.projectName;
  res.redirect("/upload");
});

// pop up window
// router.get("/createFile", function(req, res) {
//   console.log("get /createFile,", "selectedDir:", selectedDir);
//   res.render("createFile", { selectedDir: selectedDir });
// });

module.exports = router;
