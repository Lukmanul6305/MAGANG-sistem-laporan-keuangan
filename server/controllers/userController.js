const db = require("../../database/connection");
const response = require("../utils/response");

exports.getAllUsers = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM users");
    response(200, result, "data berhasil ditampilkan", res);
  } catch (err) {
    console.log(err);
    response(500, null, "data gagal ditampilkan", res);
  }
};
