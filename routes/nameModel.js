let express = require("express");
let router = express.Router();

global.modelName = "";
router.get("/", function(req, res) {
  res.render("nameModel", { modelName: modelName });
});

router.post("/", function(req, res) {
  modelName = req.body.modelName;
  console.log(modelName);
  res.render("train", { modelName: modelName });
});

module.exports = router;
