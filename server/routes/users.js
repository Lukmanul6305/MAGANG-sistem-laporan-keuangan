const express = require("express");
const router = express.Router();

const { putUsers, deleteUser, putViaProfil } = require("../controllers/userController");
const { Registrasi, login, getUsers, logout } = require("../controllers/authController");

const validateUser = require("../middlewares/validateUser");

router.get("/users", getUsers);

router.post("/registrasi", validateUser, Registrasi);
router.post("/login", login);

router.put("/", putUsers);
router.put("/profile/:userId", putViaProfil);

router.delete("/", deleteUser);
router.delete("/logout", logout);

module.exports = router;
