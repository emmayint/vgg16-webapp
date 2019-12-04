let express = require("express");
let router = express.Router();

router.get("/", function(req, res) {
  //   res.render("selectModel", {});
  console.log("router /predict");
  res.render("predict-with-visuals");
});

module.exports = router;
