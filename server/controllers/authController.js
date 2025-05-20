const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const db = require("../../database/connection"); //ganti aja
const response = require("../utils/response");
const jwt = require("jsonwebtoken");

exports.getUsers = async (req, res) => {
  try {
    const user = await Users.findOne({
      attributes: ["id", "username", "email"],
    });
    res.json(user);
  } catch (err) {
    console.log(err);
  }
};

exports.Registrasi = async (req, res) => {
  const { username, email, password, confPassword } = req.body;
  const created_at = new Date();
  if (password !== confPassword) {
    return res.status(400).json({ msg: "password tidak cocok" });
  }
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    const sql = "INSERT INTO tb_users(username,email,password,created_at) VALUES(?,?,?,?)";
    const [result] = await db.execute(sql, [username, email, hashPassword, created_at]);
    const data = {
      isSuccess: result.affectedRows,
      id: result.insertId,
    };
    response(200, data, "Registrasi Berhasil", res);
  } catch (err) {
    response(500, null, err.message, res);
  }
};

exports.login = async (req, res) => {
  try {
    const user = await Users.findAll({
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
    await Users.update(
      { refresh_token: refreshToken },
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
    res.status(404).json({ msg: "email tidak ditemukan" });
    // console.log(err);
    // response(400, err, "email tidak ditemukan", res);
  }
};

exports.logout = async (req, res) => {
  const refreshToken = req.cookies.refreshtoken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user[0]) return res.sendStatus(204);
  const userId = user[0].id;
  await Users.update(
    { refresh_token: null },
    {
      where: {
        id: userId,
      },
    }
  );
  res.clearCookie("refreshtoken");
  return res.sendStatus(200);
};
