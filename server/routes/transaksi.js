const express = require("express");
const router = express.Router();

const { postTransaksi, putTransaksi, getTransaksiSaldo, getTransaksiIncomes, getTransaksiExpens, getTransaksiBulanan,IPemasukan,IPengeluaran, getTransactions,deleteTransaction } = require("../controllers/transaksiController");

router.get("/saldo", getTransaksiSaldo);
router.get("/incomes", getTransaksiIncomes);
router.get("/expens", getTransaksiExpens);
router.get("/bulanan", getTransaksiBulanan);

router.get("/user/:userId", getTransactions); 

router.post("/IPemasukan",IPemasukan);
router.post("/IPengeluaran",IPengeluaran);
router.post("/" ,postTransaksi);

router.put("/", putTransaksi);

router.delete('/:id', deleteTransaction);

module.exports = router;
