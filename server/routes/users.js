const express = require("express");
const router = express.Router();
const validateUser = require("../middlewares/validateUser");

const { putUsers, deleteUser} = require("../controllers/userController");
const { Registrasi,login, getUsers} = require("../controllers/authController");
const { verifyToken } = require("../middlewares/VerifyToken")

router.get("/users", verifyToken ,getUsers );

router.post("/registrasi", validateUser, Registrasi);
router.post("/login" ,login);

router.put("/", putUsers);
router.delete("/", deleteUser);

module.exports = router;
