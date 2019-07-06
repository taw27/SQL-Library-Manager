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
    res.render("new-book");
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

router.get("/:id", async (req, res, next) => {
  try {
    const book = await Book.findOne({
      where: {
        id: req.params.id
      }
    });

    if (book) {
      res.locals = {
        book: book,
        title: "Update Book",
        headTitle: book.get("title"),
        routeExtension: book.get("id"),
        submitValue: "Update Book"
      };
      res.render("update-form");
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
    res.end();
  }
});

router.post("/:id", async (req, res, next) => {
  try {
    const book = await Book.findOne({
      where: {
        id: req.params.id
      }
    });

    if (book) {
      const { title, author, genre, year } = req.body;
      const updatedBook  = await book.update({ title, author, genre, year });
      res.redirect(`/books/${updatedBook.get("id")}`);
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
});

router.post("/:id/delete", async (req, res, next) => {
  try {
    const book = await Book.findOne({
      where: {
        id: req.params.id
      }
    });

    if (book) {
      await book.destroy({force: true});
      res.redirect("/books");
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
    res.end();
  }
});

router.use("/:id", async (err, req, res, next) => {
  if(err.name === "SequelizeValidationError"){
    const book = await Book.findOne({
      attributes: ["title", "id"],
      where: {
        id: req.params.id
      }
    });
    const { title, author, genre, year } = req.body;
    res.locals = {
      book: await Book.build({ id: req.params.id, title, author, genre, year}),
      title: "Update Book",
      headTitle: book.get("title"),
      routeExtension: book.get("id"),
      submitValue: "Update Book",
      errors: err.errors
    };
  }
  res.render("update-form");
});

module.exports = router;
