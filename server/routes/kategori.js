const express = require("express");
const router = express.Router();
const validateKategori = require("../middlewares/validateKategori");

const { postKatagori, putKategori, deleteKategori } = require("../controllers/kategoriController");

router.post("/", validateKategori, postKatagori);
router.put("/", putKategori);
router.delete("/", deleteKategori);

module.exports = router;
