const express = require("express")
const router = express.Router()

const {postLaporan} = require("../controllers/laporanController")

router.post("/",postLaporan)

module.exports = router
