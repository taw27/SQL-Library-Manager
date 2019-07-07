"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define(
    "Book",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: [true],
            msg: "Title is required"
          },
          notEmpty: {
            args: [true],
            msg: "Title is required"
          }
        }
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: [true],
            msg: "Author is required"
          },
          notEmpty: {
            args: [true],
            msg: "Author is required"
          }
        }
      },
      genre: DataTypes.STRING,
      year: DataTypes.INTEGER
    },
    {}
  );
  Book.associate = function(models) {
    // associations can be defined here
  };

  Book.getNumPages = async function(query, perPage) {
    try {
      const Op = Sequelize.Op;
      const totalRecords = await this.count({
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
    } catch (err) {
      throw new Error("Error getting pages");
    }
  };

  Book.findByQueryAndPagination = async function(
    query,
    booksPerPage,
    currentPage
  ) {
    try {
      const Op = Sequelize.Op;
      return await this.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.substring]: query } },
            { genre: { [Op.substring]: query } },
            { year: { [Op.substring]: query } },
            { author: { [Op.substring]: query } }
          ]
        },
        order: [["title", "ASC"], ["genre", "ASC"], ["author", "ASC"]],
        limit: booksPerPage,
        offset: (currentPage - 1) * booksPerPage
      });
    } catch (err) {
      throw err;
    }
  };

  Book.findById = async function(id){
    return await this.findOne({
      where: {
        id
      }
    });
  };

  Book.buildTempBook = async function(id = "", title ="", author="", genre= "", year=""){
    return await this.build({
      id,
      title,
      author,
      genre,
      year
    });
  };

  return Book;
};
