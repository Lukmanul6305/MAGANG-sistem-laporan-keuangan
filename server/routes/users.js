const express = require("express");
const router = express.Router();
const { getAllUsers, postUsers, putUsers, deleteUser } = require("../controllers/userController");

router.get("/", getAllUsers);
router.post("/", postUsers);
router.put("/", putUsers);
router.delete("/", deleteUser);

module.exports = router;
