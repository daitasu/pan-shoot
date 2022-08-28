const express = require("express");
const basicAuth = require("basic-auth-connect");
const app = express();

const gameuser = process.env.GAMEUSER;
const pass = process.env.PASSWORD;

if (gameuser && pass) {
  app.use(basicAuth(gameuser, pass));
}

app.set("port", process.env.PORT || 4000);
app.use(express.static(__dirname + "/public"));

app.listen(app.get("port"), function () {
  console.log("Listening on port " + app.get("port"));
});

