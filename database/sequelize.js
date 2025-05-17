const { Sequelize } = require("sequelize");

const db = new Sequelize("sistem_laporan_keuangan", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = db;
