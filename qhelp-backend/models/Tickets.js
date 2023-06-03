const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../db/connect");

const Ticket = sequelize.define(
  "ticket",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user: {
      type: DataTypes.STRING,
    },
    from: {
      type: DataTypes.STRING,
    },
    subject: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    agent: {
      type: DataTypes.STRING,
    },
    state: {
      type: DataTypes.ENUM,
      values: ["open", "closed"],
    },
    root: {
      type: DataTypes.STRING,
    },
    duration: {
      type: DataTypes.STRING,
    },
    date: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  { timestamps: false }
);

sequelize
  .sync()
  .then(() => {
    console.log("Table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

module.exports = Ticket;
