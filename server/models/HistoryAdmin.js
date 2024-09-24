const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const HistoryAdmin = sequelize.define(
  "HistoryAdmin",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    old_product_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    new_product_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    old_product_price: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    new_product_price: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    old_product_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    new_product_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    old_product_images: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    new_product_images: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    old_product_category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    new_product_category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    old_product_quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    new_product_quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = HistoryAdmin;
