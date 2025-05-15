const express = require("express")
const router = express.Router()

const {postKatagori,putKategori,deleteKategori} = require("../controllers/kategoriController")

router.post('/',postKatagori)
router.put('/',putKategori)
router.delete("/",deleteKategori)

module.exports = router