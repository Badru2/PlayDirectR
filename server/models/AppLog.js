const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AppLog = sequelize.define("AppLog", {
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stack: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  route: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = AppLog;
