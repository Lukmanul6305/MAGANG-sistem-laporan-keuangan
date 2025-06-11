const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const db = require("../../database/connection"); //ganti aja
const response = require("../utils/response"); // Assuming this utility is still used elsewhere, otherwise it can be removed.

/**
 * @desc Get all users (or a single user, as per original implementation)
 * @route GET /users
 * @access Public
 */
exports.getUsers = async (req, res) => {
  try {
    // Original code only fetched one user. If you want to fetch all users,
    // you would use `Users.findAll()` without a where clause.
    const user = await Users.findOne({
      attributes: ["id", "username", "email"],
    });
    res.json(user);
  } catch (err) {
    console.error("Error fetching users:", err); // Use console.error for errors
    res.status(500).json({ msg: "Gagal mengambil data user" });
  }
};

exports.Registrasi = async (req, res) => {
  const { username, email, password, confPassword } = req.body;
  const created_at = new Date();

  if (!username || !email || !password || !confPassword) {
    return res.status(400).json({ msg: "Data belum diisi lengkap" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ msg: "Format email tidak cocok" });
  }

  if (password !== confPassword) {
    return res.status(400).json({ msg: "Password tidak cocok" });
  }

  try {
    const existingUser = await Users.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(409).json({ msg: "Email sudah terdaftar" });
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const sql = "INSERT INTO tb_users(username,email,password,created_at) VALUES(?,?,?,?)";
    const [result] = await db.execute(sql, [username, email, hashPassword, created_at]);

    res.status(201).json({ msg: "Berhasil membuat user" });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ msg: "Gagal membuat user" });
  }
};


exports.login = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "Email tidak ditemukan" });
    }

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return res.status(400).json({ msg: "Password salah" });
    }

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email
    };
    res.status(200).json({ 
      msg: "Login berhasil!",
      user: userData
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ msg: "Terjadi kesalahan server saat login" });
  }
};

exports.logout = async (req, res) => {
  res.status(200).json({ msg: "Anda telah logout" });
};
