let express = require("express");
let router = express.Router();

global.model = "";

router.get("/", function(req, res) {
  //   res.render("selectModel", {});
  res.render("selectModel", { model: model });
});

module.exports = router;
