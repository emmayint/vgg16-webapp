let express = require("express");
let router = express.Router();

global.epoch = 9;
global.batch_size = 4;
global.steps_per_epoch = 10;

router.get("/", function(req, res) {
  //   res.render("selectModel", {});
  res.render("params", { epoch: epoch });
});

router.post("/", function(req, res) {
  //   res.render("selectModel", {});
  epoch = req.body.epoch;
  batch_size = req.body.batch_size;
  steps_per_epoch = req.body.steps_per_epoch;
  res.render("params", {
    epoch: epoch,
    batch_size: batch_size,
    steps_per_epoch: steps_per_epoch
  });
});

module.exports = router;
