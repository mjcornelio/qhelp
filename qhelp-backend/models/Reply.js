const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../db/connect");

const Reply = sequelize.define(
  "reply",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    agent: {
      type: DataTypes.STRING,
    },
    message: {
      type: DataTypes.STRING,
    },
    reply_to: {
      type: DataTypes.STRING,
    },
    date: {
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

module.exports = Reply;
