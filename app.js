const express = require("express");
const path = require("path");
const sequelize = require("./models").sequelize;
const app = express();
const booksRouter = require("./routes/books");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;

/* 
  set view engine to pug and set views folder
 */
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

/* 
  serve static assets
 */
app.use("/static", express.static(path.join(__dirname, "public")));

/* 
  add middle ware to parse request body and convert to json object
 */
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.json());

/* 
  redirect to /books route for the index route
*/
app.get("/", (req, res) => {
  res.redirect("/books");
});

/* 
  use the books router for all /books routes
 */
app.use("/books", booksRouter);

/*  
  if route mnot found set error status to 404
*/
app.use((req, res) => {
  res.locals.title = "Page Not Found";
  res.status(404).render("page-not-found");
});

/* 
  render the server error page with the error passed in
 */
app.use((err, req, res, next) => {
  res.locals = { title: err.message, error: err, headTitle:"Server Error"};
  res.status(500).render("server-error");
});

/* 
  sync db then start server
 */
sequelize.sync().then(() => {
  app.listen(PORT);
});
