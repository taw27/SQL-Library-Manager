const express = require("express");
const router = express.Router();
const Book = require("../models").Book;

router.get("/", async (req, res) => {
  try {
    const books = await Book.findAll({
      order: [["title", "ASC"], ["genre", "ASC"], ["author", "ASC"]]
    });
    res.locals.books = books;
    res.locals.title = "Books";
    res.render("index");
  } catch (err) {
    console.log(err);
    res.end();
  }
});

router.get("/:id", async (req, res) => {
  try {
    const books = await Book.findAll({
      where: {
        id: req.params.id
      }
    });

    if (books.length === 1) {
      res.locals = {
        book: books[0],
        title: "Update Book",
        headTitle: books[0].get("title"),
        routeExtension: books[0].get("id"),
        submitValue: "Update Book"
      };
      res.render("update-form");
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    res.end();
  }
});

router.put("/new", async (req, res) => {
  try{
    
  } catch(err){
    console.log(err);
    res.redirect("books/new");
  }
});

router.put("/:id/put", async (req, res) => {

});


module.exports = router;
