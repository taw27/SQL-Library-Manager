const express = require("express");
const path = require("path");
const sequelize = require("./models").sequelize;
const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.send("Test");
});
sequelize.sync().then(() => {
  app.listen(PORT);
});
