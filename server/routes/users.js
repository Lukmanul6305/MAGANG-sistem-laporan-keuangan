const express = require("express");
const router = express.Router();
const validateUser = require("../middlewares/validateUser");

const { getAllUsers, postUsers, putUsers, deleteUser } = require("../controllers/userController");
const {Register} = require("../controllers/authController")

router.get("/", getAllUsers);
// router.post("/", validateUser, postUsers);
router.post("/", Register,validateUser,postUsers);

router.put("/", putUsers);
router.delete("/", deleteUser);

module.exports = router;
