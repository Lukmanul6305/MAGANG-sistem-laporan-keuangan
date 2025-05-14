const express = require("express");
const router = express.Router();
const { getAllUsers,postUsers } = require("../controllers/userController");

router.get("/", getAllUsers);
router.post("/",postUsers)

module.exports = router;
