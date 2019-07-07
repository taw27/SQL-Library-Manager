"use strict";
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
            msg:"Title is required"
          },
          notEmpty: {
            args:[true],
            msg:"Title is required"
          },
        }
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: [true],
            msg:"Author is required"
          },
          notEmpty: {
            args:[true],
            msg:"Author is required"
          },
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
  return Book;
};
