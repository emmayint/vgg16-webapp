let express = require("express");
let router = express.Router();

global.selectedModel = "";

router.get("/", function(req, res) {
  res.render("selectModel", { selectedModel: selectedModel });
});

router.post("/", function(req, res) {
  console.log("post /selectModel with body:", req.body);
  selectedModel = req.body.selectedModel;
  res.render("selectModel", { selectedModel: selectedModel });
});

module.exports = router;
