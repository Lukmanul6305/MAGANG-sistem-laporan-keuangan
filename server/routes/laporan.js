const express = require("express")
const router = express.Router()

const {postLaporan,putLaporan,deletelaporan} = require("../controllers/laporanController")

router.post("/",postLaporan)
router.put('/',putLaporan)
router.delete("/",deletelaporan)


const { 
    getLaporanSummary, 
    getLaporanTransaksi,
    generateLaporan,
    getWeeklyChartData
} = require('../controllers/laporanController');

// Rute untuk mendapatkan 3 card ringkasan (saldo, pemasukan, pengeluaran)
router.get('/summary/:userId', getLaporanSummary);

// Rute untuk mendapatkan data tabel transaksi yang sudah difilter
router.get('/transaksi/:userId', getLaporanTransaksi);

// Rute untuk men-trigger pembuatan laporan (PDF/Excel)
router.post('/generate/:userId', generateLaporan);

router.get('/chart/weekly/:userId', getWeeklyChartData);


module.exports = router
