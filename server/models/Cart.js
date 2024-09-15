const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Product = require("./Product");
const User = require("./User");

const Cart = sequelize.define(
  "Cart",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

Cart.associate = function (models) {
  Cart.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
  Cart.belongsTo(models.Product, { foreignKey: "product_id", as: "product" });
};

module.exports = Cart;
