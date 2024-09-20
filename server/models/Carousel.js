const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Carousel = sequelize.define(
  "Carousel",
  {
    images: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Carousel;
