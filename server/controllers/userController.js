const db = require("../../database/connection");
const response = require("../utils/response");
const bcrypt = require("bcrypt");

exports.getAllUsers = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM tb_users");
    response(200, result, "data berhasil ditampilkan", res);
  } catch (err) {
    console.log(err);
    response(500, null, "data gagal ditampilkan", res);
  }
};

exports.postUsers = async (req, res) => {
  const { username, email, password } = req.body;
  const created_at = new Date();
  try {
    const hashePassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO tb_users(username,email,password,created_at) VALUES(?,?,?,?)";
    const [result] = await db.execute(sql, [username, email, hashePassword, created_at]);
    const data = {
      isSuccess: result.affectedRows,
      id: result.insertId,
    };
    response(200, data, "Berhasil", res);
  } catch (err) {
    response(500, null, err.message, res);
  }
};

exports.putUsers = async (req, res) => {
  try {
    const { username, email, password, id } = req.body;
    const sql = `UPDATE tb_users SET username = ?,email = ?,password = ? WHERE id = ?`;
    const [fields] = await db.execute(sql, [username, email, password, id]);
    const data = {
      isSuccess: fields.affectedRows,
      id: fields.insertId,
    };
    response(500, data, "update valid", res);
  } catch (err) {
    response(500, err.message, "update invalid", res);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.body;
    const [result] = await db.execute("DELETE FROM tb_users WHERE id = ?", [id]);
    const data = {
      isSuccess: result.affectedRows > 0,
      deletedCount: result.affectedRows,
    };

    response(200, data, "Data berhasil dihapus", res);
  } catch (err) {
    res.send(err);
    response(500, err, "data gagal dihapus", res);
  }
};
