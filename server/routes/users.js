const express = require("express");
const router = express.Router();
const validateUser = require("../middlewares/validateUser");

const { postUsers, putUsers, deleteUser, login } = require("../controllers/userController");

// router.get("/", getAllUsers);
router.post("/", validateUser, postUsers);
router.post("/login", login);

router.put("/", putUsers);
router.delete("/", deleteUser);

module.exports = router;
