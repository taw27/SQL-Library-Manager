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

router.get("/new", async (req, res) => {
  try {
    const book = await Book.build({
      title: "",
      author: "",
      genre: "",
      year: ""
    });
    res.locals = {
      book,
      title: "New Book",
      headTitle: "New Book",
      routeExtension: "new",
      submitValue: "Create New Book"
    };
    res.render("new-form");
  } catch (err) {
    console.log(err);
    res.end();
  }
});

router.post("/new", async (req, res) => {
  try {
    const { title, author, genre, year } = req.body;
    const [book] = await Book.findOrCreate({
      where: { title, author, genre, year }
    });
    res.redirect(`/books/${book.get("id")}`);
  } catch (err) {
    console.log(err);
    res.redirect("/books/new");
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

module.exports = router;
