const express = require("express")
const router = express.Router()
const {postTransaksi,putTransaksi,deleteTransaksi} = require("../controllers/transaksiController")

router.post("/",postTransaksi)
router.put("/",putTransaksi)
router.delete("/",deleteTransaksi)

module.exports = router
