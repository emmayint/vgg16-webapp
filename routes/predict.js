let express = require("express");
let router = express.Router();

router.get("/", function(req, res) {
  //   res.render("selectModel", {});
  console.log("router /predict");
  res.render("static/predict-with-visuals.html");
});

module.exports = router;
