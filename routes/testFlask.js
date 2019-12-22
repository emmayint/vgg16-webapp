let express = require("express");
let router = express.Router();
const axios = require("axios");

router.get("/", function(req, res) {
  console.log("router /testFlask");
  const body = {
    selectedModel: selectedModel,
    projectName: projectName,
    modelName: modelName
  };
  console.log("global variables: ", selectedModel, projectName, modelName);
  axios
    .post("http://localhost:5000/testFlask", body)
    .then(res => {
      console.log("flask response: ", res.data);
    })
    .catch(console.log);
  res.send(res.data);
});

module.exports = router;
