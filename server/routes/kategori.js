const express = require("express")
const router = express.Router()

const {postKatagori} = require("../controllers/kategoriController")

router.post('/',postKatagori)

module.exports = router