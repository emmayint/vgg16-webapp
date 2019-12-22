const express = require("express");
const app = express();
let path = require("path");
let multer = require("multer");

let bodyParser = require("body-parser");

app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.engine("html", require("ejs").renderFile);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

let uploadRouter = require("./routes/upload");
let selectModelRouter = require("./routes/selectModel");
let paramsRouter = require("./routes/params");
let nameModelRouter = require("./routes/nameModel");
let predictRouter = require("./routes/predict");
let testFlaskRouter = require("./routes/testFlask");

app.use("/upload", uploadRouter);
app.use("/selectModel", selectModelRouter);
app.use("/params", paramsRouter);
app.use("/nameModel", nameModelRouter);
// app.use("/predict", predictRouter);
app.use("/testFlask", testFlaskRouter);

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/predict", (req, res) => {
  res.redirect("http://localhost:5000/static/predict-with-visuals.html", {
    epoch: epoch
  });
});

app.listen(8000, () => {
  console.log("Example app listening on port 8000!");
});
