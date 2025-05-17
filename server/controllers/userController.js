const db = require("../../database/connection");
// const db = require("../../database/sequelize");
const response = require("../utils/response");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../models/userModel");

const getAllUsers = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM tb_users");
    response(200, result, "data berhasil ditampilkan", res);
  } catch (err) {
    console.log(err);
    response(500, null, "data gagal ditampilkan", res);
  }
};

exports.postUsers = async (req, res) => {
  const { username, email, password, confPassword } = req.body;
  const created_at = new Date();
  if (password !== confPassword) {
    return res.status(400).json({ msg: "password tidak cocok" });
  }
  const salt = await bcrypt.genSalt();
  const hashePassword = await bcrypt.hash(password, salt);
  try {
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

exports.login = async (req, res) => {
  try {
    const user = await getAllUsers.findAll({
      where: {
        email: req.body.email,
      },
    });
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: "Wrong Password" });
    const userId = user[0].id;
    const name = user[0].username;
    const email = user[0].email;
    const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "20s",
    });
    const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });
    await getAllUsers.update(
      { refresh_Token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );
    res.cookie("refreshtoken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (err) {
    // res.status(404).json({ msg: "email tidak ditemukan" });
    console.log(err);
    response(400, err, "email tidak ditemukan", res);
  }
};
