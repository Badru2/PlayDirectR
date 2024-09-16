const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Product = require("./Product");
const Cart = require("./Cart");

const User = sequelize.define(
  "User",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("superAdmin", "admin", "user"),
      defaultValue: "user",
    },
  },
  {
    timestamps: true,
  }
);

// User.associate = (models) => {
//   User.hasMany(models.Product, { foreignKey: "user_id" });
//   User.hasMany(models.Cart, { foreignKey: "user_id" });
// };

module.exports = User;
