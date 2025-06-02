const express = require("express")
const router = express.Router()
const {postTransaksi,putTransaksi,deleteTransaksi,getTransaksiSaldo,getTransaksiIncomes, getTransaksiExpens,getTransaksiBulanan} = require("../controllers/transaksiController")

router.get('/saldo',getTransaksiSaldo)
router.get('/incomes',getTransaksiIncomes)
router.get('/expens',getTransaksiExpens)
router.get('/bulanan',getTransaksiBulanan)
router.post("/",postTransaksi)
router.put("/",putTransaksi)
router.delete("/",deleteTransaksi)

module.exports = router
