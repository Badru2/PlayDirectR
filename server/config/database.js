const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config({ path: "../.env" });

// Create a Sequelize instance with PostgreSQL connection
const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.SERVER_HOST, // or your PostgreSQL server address
    dialect: "postgres", // specify PostgreSQL as the dialect
    logging: false, // disable logging (optional)
    pool: {
      max: 5, // max number of connections
      min: 0, // min number of connections
      acquire: 30000, // max time in ms that a connection can be idle before being released
      idle: 10000, // max time in ms that a connection can be idle before being released
    },
  }
);

// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = sequelize;
