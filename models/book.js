"use strict";
const Sequelize = require("sequelize");
/* 
  Book model definition and model methods
 */
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

  /* 
    returns the number of pages required based on the query and records per page
   */
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

  /* 
    returns all records based on query, the current page, and books per page
   */
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

  /* 
    returns record based on id
   */
  Book.findById = async function(id){
    return await this.findOne({
      where: {
        id
      }
    });
  };

  /* 
    returns a tempory record instance based on fields passed in. 
    Will default to empty strings if parameter not passed in
   */
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
