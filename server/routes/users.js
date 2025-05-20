const express = require("express");
const router = express.Router();

const { putUsers, deleteUser } = require("../controllers/userController");
const { Registrasi, login, getUsers, logout } = require("../controllers/authController");
const { refreshToken } = require("../controllers/refreshToken");

const { verifyToken } = require("../middlewares/VerifyToken");
const validateUser = require("../middlewares/validateUser");

router.get("/users", verifyToken, getUsers);
router.get("/token", refreshToken);

router.post("/registrasi", validateUser, Registrasi);
router.post("/login", login);

router.put("/", putUsers);

router.delete("/", deleteUser);
router.delete("/logout", logout);

module.exports = router;
