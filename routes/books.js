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

module.exports = router;
