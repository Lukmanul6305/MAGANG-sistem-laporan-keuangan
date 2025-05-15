const mysql = require("mysql2/promise");

const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "sistem_laporan_keuangan",
  queueLimit: 0,
  connectionLimit: 10,
  waitForConnections: true,
});

module.exports = connection;
