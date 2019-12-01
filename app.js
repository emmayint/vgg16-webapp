const express = require("express");
const app = express();
let path = require("path");
let multer = require("multer");

let bodyParser = require("body-parser");

app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

let uploadRouter = require("./routes/upload");
let selectModelRouter = require("./routes/selectModel");

app.use("/upload", uploadRouter);
app.use("/selectModel", selectModelRouter);

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(8000, () => {
  console.log("Example app listening on port 8000!");
});
