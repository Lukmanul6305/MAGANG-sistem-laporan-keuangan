const express = require("express");
const router = express.Router();

const { putUsers, deleteUser, getAllUsers } = require("../controllers/userController");
const { Registrasi, login, getUsers, logout } = require("../controllers/authController");

const validateUser = require("../middlewares/validateUser");

router.get("/allUsers",getAllUsers)

router.get("/users", getUsers);

router.post("/registrasi", validateUser, Registrasi);
router.post("/login", login);

router.put("/", putUsers);

router.delete("/", deleteUser);
router.delete("/logout", logout);

module.exports = router;
