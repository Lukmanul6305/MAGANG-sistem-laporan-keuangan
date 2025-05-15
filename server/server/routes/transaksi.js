const express = require("express")
const router = express.Router()
const {postTransaksi} = require("../controllers/transaksiController")

router.post("/",postTransaksi)

module.exports = router
