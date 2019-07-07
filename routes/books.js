const express = require("express");
const router = express.Router();
const Book = require("../models").Book;

router.get("/", async (req, res, next) => {
  try {
    const booksPerPage = 14;
    const query = req.query.query ? req.query.query : "";
    const numPages = await Book.getNumPages(query, booksPerPage);
    const activePage = req.query.page? parseInt(req.query.page): (numPages === 0 ? 0: 1);
    if (activePage > numPages || activePage < 0) {
      return next();
    }
    const books = await Book.findByQueryAndPagination(
      query,
      booksPerPage,
      activePage
    );
    res.locals.books = books;
    res.locals.title = "Books";
    res.locals.pages = numPages;
    res.locals.query = query;
    res.locals.activePage = activePage;
    res.render("index");
  } catch (err) {
    return next(err);
  }
});

router.get("/new", async (req, res, next) => {
  try {
    const book = await Book.buildTempBook();
    res.locals = {
      book,
      title: "New Book",
      headTitle: "New Book",
      routeExtension: "new",
      submitValue: "Create New Book"
    };
    res.render("new-book");
  } catch (err) {
    return next(err);
  }
});

router.post("/new", async (req, res, next) => {
  try {
    const { title, author, genre, year } = req.body;
    const [book] = await Book.findOrCreate({
      where: { title, author, genre, year }
    });
    res.redirect(`/books/${book.get("id")}`);
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

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
      return next();
    }
  } catch (err) {
    return next(err);
  }
});

router.post("/:id", async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      const { title, author, genre, year } = req.body;
      const updatedBook = await book.update({ title, author, genre, year });
      res.redirect(`/books/${updatedBook.get("id")}`);
    } else {
      return next();
    }
  } catch (err) {
    return next(err);
  }
});

router.post("/:id/delete", async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id)

    if (book) {
      await book.destroy({ force: true });
      res.redirect("/books");
    } else {
      return next();
    }
  } catch (err) {
    return next(err);
  }
});

router.use("/new", async (err, req, res, next) => {
  try {
    if (err.name === "SequelizeValidationError") {
      const { title, author, genre, year } = req.body;
      res.locals = {
        book: await Book.buildTempBook(req.params.id, title, author, genre, year),
        title: "New Book",
        headTitle: "New Book",
        routeExtension: "new",
        submitValue: "Create New Book",
        errors: err.errors
      };
      res.render("new-book");
    } else {
      return next(err);
    }
  } catch (err) {
    return next(err);
  }
});

router.use("/:id", async (err, req, res, next) => {
  try {
    if (err.name === "SequelizeValidationError") {
      const book = await Book.findById(req.params.id);

      const { title, author, genre, year } = req.body;
      res.locals = {
        book: await Book.buildTempBook(req.params.id, title, author, genre, year),
        title: "Update Book",
        headTitle: book.get("title"),
        routeExtension: book.get("id"),
        submitValue: "Update Book",
        errors: err.errors
      };
      res.render("update-form");
    } else {
      return next(err);
    }
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
