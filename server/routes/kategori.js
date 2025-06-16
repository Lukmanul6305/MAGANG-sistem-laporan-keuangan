const express = require("express");
const router = express.Router();
const validateKategori = require("../middlewares/validateKategori");

const { postKatagori, putKategori, deleteKategori } = require("../controllers/kategoriController");
const { getCategoriesByUser } = require('../controllers/kategoriController');
router.get('/user/:userId', getCategoriesByUser);

router.post("/", validateKategori, postKatagori);
router.put("/", putKategori);
router.delete("/", deleteKategori);

module.exports = router;
