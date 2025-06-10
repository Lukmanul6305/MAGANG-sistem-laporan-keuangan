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

/**
 * @desc Register a new user
 * @route POST /register
 * @access Public
 */
exports.Registrasi = async (req, res) => {
  const { username, email, password, confPassword } = req.body;
  const created_at = new Date();

  // Input validation
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
    // Check if email already exists
    const existingUser = await Users.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(409).json({ msg: "Email sudah terdaftar" }); // 409 Conflict
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const sql = "INSERT INTO tb_users(username,email,password,created_at) VALUES(?,?,?,?)";
    const [result] = await db.execute(sql, [username, email, hashPassword, created_at]);

    // In a no-token scenario, typically you'd just confirm creation.
    // The 'data' object here is not strictly needed for the response,
    // but the original code had 'result.affectedRows' and 'result.insertId'.
    // const data = {
    //   isSuccess: result.affectedRows,
    //   id: result.insertId,
    // };

    res.status(201).json({ msg: "Berhasil membuat user" }); // 201 Created
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ msg: "Gagal membuat user" });
  }
};

/**
 * @desc User login (without tokens)
 * @route POST /login
 * @access Public
 */
exports.login = async (req, res) => {
  try {
    const user = await Users.findOne({
      // Use findOne instead of findAll for a single user
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      // Check if user exists
      return res.status(404).json({ msg: "Email tidak ditemukan" });
    }

    const match = await bcrypt.compare(req.body.password, user.password); // user[0].password becomes user.password
    if (!match) {
      return res.status(400).json({ msg: "Password salah" });
    }

    // Since there are no tokens, a successful login just means
    // the credentials are correct. You might redirect the user
    // or return a simple success message.
    res.status(200).json({ msg: "Login berhasil!" });
  } catch (err) {
    console.error("Error during login:", err);
    // If the error isn't a 404 (user not found), it's an internal server error.
    res.status(500).json({ msg: "Terjadi kesalahan server saat login" });
  }
};

/**
 * @desc User logout (without tokens)
 * @route DELETE /logout
 * @access Public (or depends on your session management if not using tokens)
 */
exports.logout = async (req, res) => {
  // In a system without tokens or session management,
  // there's typically nothing to "log out" on the server-side.
  // The client would simply forget the user's logged-in state.
  // This function would just confirm the "logout" action.

  // If you later implement session management (e.g., Express sessions),
  // this is where you'd destroy the server-side session.
  res.status(200).json({ msg: "Anda telah logout" });
};
