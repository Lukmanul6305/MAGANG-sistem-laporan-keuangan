const express = require("express")
const router = express.Router()

const {postLaporan,putLaporan,deletelaporan} = require("../controllers/laporanController")

router.post("/",postLaporan)
router.put('/',putLaporan)
router.delete("/",deletelaporan)

module.exports = router
