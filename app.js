const express = require("express");
const path = require("path");
const sequelize = require("./models").sequelize;
const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use("/static", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.redirect("/books");
});
sequelize.sync().then(() => {
  app.listen(PORT);
});
