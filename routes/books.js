const express = require("express");
const router = express.Router();
const Book = require("../models").Book;
const Sequelize = require("../models").Sequelize;

router.get("/", async (req, res, next) => {
  try {
    const query = req.query.query ? req.query.query : "";
    const Op = Sequelize.Op;
    const books = await Book.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.substring]: query } },
          { genre: { [Op.substring]: query } },
          { year: { [Op.substring]: query } },
          { author: { [Op.substring]: query } }
        ]
      },
      order: [["title", "ASC"], ["genre", "ASC"], ["author", "ASC"]]
    });
    res.locals.books = books;
    res.locals.title = "Books";
    res.locals.pages = await getNumPages(query, 3);
    res.render("index");
  } catch (err) {
    next(err);
  }
});

router.get("/new", async (req, res, next) => {
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
    next(err);
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
    next(err);
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
    next(err);
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
      const updatedBook = await book.update({ title, author, genre, year });
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
      await book.destroy({ force: true });
      res.redirect("/books");
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
});

router.use("/new", async (err, req, res, next) => {
  try {
    if (err.name === "SequelizeValidationError") {
      const { title, author, genre, year } = req.body;
      res.locals = {
        book: await Book.build({
          id: req.params.id,
          title,
          author,
          genre,
          year
        }),
        title: "New Book",
        headTitle: "New Book",
        routeExtension: "new",
        submitValue: "Create New Book",
        errors: err.errors
      };
      res.render("new-book");
    } else {
      next(err);
    }
  } catch (err) {
    next(err);
  }
});

router.use("/:id", async (err, req, res, next) => {
  try {
    if (err.name === "SequelizeValidationError") {
      const book = await Book.findOne({
        attributes: ["title", "id"],
        where: {
          id: req.params.id
        }
      });
      const { title, author, genre, year } = req.body;
      res.locals = {
        book: await Book.build({
          id: req.params.id,
          title,
          author,
          genre,
          year
        }),
        title: "Update Book",
        headTitle: book.get("title"),
        routeExtension: book.get("id"),
        submitValue: "Update Book",
        errors: err.errors
      };
      res.render("update-form");
    } else {
      next(err);
    }
  } catch (err) {
    next(err);
  }
});

async function getNumPages(query, perPage){
  try{
    const Op = Sequelize.Op;
    const totalRecords = await Book.count({
      where: {
        [Op.or]: [
          { title: { [Op.substring]: query } },
          { genre: { [Op.substring]: query } },
          { year: { [Op.substring]: query } },
          { author: { [Op.substring]: query } }
        ]
      },
      order: [["title", "ASC"], ["genre", "ASC"], ["author", "ASC"]]
    });

    return Math.ceil(totalRecords / perPage);
  }catch(err){
    throw new Error("Error getting pages");
  }
}

module.exports = router;
