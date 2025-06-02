const db = require("../../database/connection")
const response = require("../utils/response")


exports.getTransaksiSaldo = async (req, res) => {
    try {
        const [result] = await db.query(
            // `SELECT SUM(jumlah) AS total_saldo FROM tb_transaksi WHERE tipe = 'Pemasukan'`
            `
            SELECT
                SUM(CASE WHEN tipe = 'Pemasukan' THEN jumlah ELSE 0 END) AS total_pemasukan,
                SUM(CASE WHEN tipe = 'Pengeluaran' THEN jumlah ELSE 0 END) AS total_pengeluaran,
                SUM(CASE WHEN tipe = 'Pemasukan' THEN jumlah ELSE 0 END) -
                SUM(CASE WHEN tipe = 'Pengeluaran' THEN jumlah ELSE 0 END) AS total_saldo
            FROM tb_transaksi
            `
        );
        res.json(result[0]); // karena hasilnya cuma 1 baris, langsung ambil [0]
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getTransaksiExpens = async (req, res) => {
    try {
        const [result] = await db.query(
            `SELECT SUM(jumlah) AS total_pengeluaran FROM tb_transaksi WHERE tipe = 'Pengeluaran'`
        );
        res.json(result[0]); // karena hasilnya cuma 1 baris, langsung ambil [0]
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getTransaksiIncomes = async (req, res) => {
    try {
        const [result] = await db.query(
            `SELECT SUM(jumlah) AS total_pemasukan  FROM tb_transaksi  WHERE tipe = 'Pemasukan'`
        );
        res.json(result[0]); // karena hasilnya cuma 1 baris, langsung ambil [0]
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getTransaksiBulanan = async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT 
        DATE_FORMAT(tanggal, '%Y-%m') AS bulan,
        SUM(CASE WHEN tipe = 'Pemasukan' THEN jumlah ELSE 0 END) AS total_pemasukan,
        SUM(CASE WHEN tipe = 'Pengeluaran' THEN jumlah ELSE 0 END) AS total_pengeluaran
      FROM tb_transaksi
      GROUP BY DATE_FORMAT(tanggal, '%Y-%m')
      ORDER BY bulan
    `);

    res.json(result); // kirim array data bulanan
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




exports.postTransaksi = async (req,res)=>{
    try{
        const {user_id,kategori_id,tipe,jumlah,deskripsi,tanggal} = req.body
        const created_at = new Date()
        const sql = "INSERT INTO tb_transaksi(user_id,kategori_id,tipe,jumlah,deskripsi,tanggal,created_at) VALUES(?,?,?,?,?,?,?)"
        const [fields] =  await db.execute(sql,[user_id,kategori_id,tipe,jumlah,deskripsi,tanggal,created_at])
        const data = {
            isSuccess : fields.affectedRows,
            id : fields.insertId
        }
        response(200,data,"data berhasil ditambah",res)
    }catch(err){
        response(500,err,"data gagal ditambah",res)
    }
}

exports.putTransaksi = async (req,res)=>{
    try{
        const {tipe,jumlah,deskripsi,tanggal,id} = req.body
        const sql = "UPDATE tb_transaksi SET tipe =?,jumlah = ?,deskripsi = ?,tanggal = ? WHERE id = ?"
        const [fields] = await db.execute(sql,[tipe,jumlah,deskripsi,tanggal,id])
        const data = {
            isSuccess : fields.affectedRows,
            id : fields.insertId
        }
        response(200,data,"updata data berhasil",res)
    }catch(err){
        response(500,err,"updata data gagal",res)
    }
}

exports.deleteTransaksi = async (req,res)=>{
    try{
        const {id} = req.body
        const sql = "DELETE FROM tb_transaksi WHERE id = ?"
        const [result] = db.execute(sql,[id])
        response(200,result,"hapus berhasil",res)
    }catch(err){
        response(500,err,"hapus gagal",res)

    }
}


