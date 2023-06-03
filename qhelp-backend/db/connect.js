const { Sequelize } = require("sequelize");

const connectDB = new Sequelize("qualimed_ticket_sys", "root", "", {
  host: "localhost",
  dialect: "mysql",
  port: 3306,
});

module.exports = connectDB;
