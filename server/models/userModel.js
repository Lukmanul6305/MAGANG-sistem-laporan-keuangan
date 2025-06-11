const { sequelize, DataTypes } = require("sequelize");
const db = require("../../database/sequelize");

const Users = db.define(
  "tb_users",
  {
    username: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Users;
