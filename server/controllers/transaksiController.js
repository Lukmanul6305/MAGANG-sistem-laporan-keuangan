const db = require("../../database/connection");
const response = require("../utils/response");

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
    const [result] = await db.query(`SELECT SUM(jumlah) AS total_pengeluaran FROM tb_transaksi WHERE tipe = 'Pengeluaran'`);
    res.json(result[0]); // karena hasilnya cuma 1 baris, langsung ambil [0]
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getTransaksiIncomes = async (req, res) => {
  try {
    const [result] = await db.query(`SELECT SUM(jumlah) AS total_pemasukan  FROM tb_transaksi  WHERE tipe = 'Pemasukan'`);
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

exports.IPemasukan = async (req, res) => {
  try {
    const { tanggal, tipe, jumlah, nama_kategori, metode_pembayaran, deskripsi } = req.body;
    const created_at = new Date();

    // Tambahkan kategori baru ke tb_kategori
    const [kategori] = await db.execute(`INSERT INTO tb_kategori(nama_kategori,tipe) VALUES (?,?)`, [nama_kategori, tipe]);
    const idKategori = kategori.insertId;

    // Tambahkan transaksi ke tb_transaksi
    await db.execute(`INSERT INTO tb_transaksi(user_id,kategori_id,tanggal, tipe, jumlah, metode_pembayaran, deskripsi,created_at) VALUES (?,?,?, ?, ?, ?, ?,?)`, [
      user_id,
      idKategori,
      tanggal,
      tipe,
      jumlah,
      metode_pembayaran,
      deskripsi,
      created_at,
    ]);

    // Kirim respon sukses ke frontend
    res.status(200).json({ message: "Data berhasil dibuat" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menyimpan data", error: err.message });
  }
};

exports.IPengeluaran = async (req, res) => {
  try {
    const { tanggal, tipe, jumlah, nama_kategori, metode_pembayaran, deskripsi } = req.body;
    const created_at = new Date();

    // 1. Hitung total pemasukan
    const [totalPemasukan] = await db.execute(
      `SELECT SUM(jumlah) AS total FROM tb_transaksi 
       INNER JOIN tb_kategori ON tb_transaksi.kategori_id = tb_kategori.id 
       WHERE tb_kategori.tipe = 'Pemasukan' AND tb_kategori.user_id = ?`,
      [userId]
    );

    // 2. Hitung total pengeluaran
    const [totalPengeluaran] = await db.execute(
      `SELECT SUM(jumlah) AS total FROM tb_transaksi 
       INNER JOIN tb_kategori ON tb_transaksi.kategori_id = tb_kategori.id 
       WHERE tb_kategori.tipe = 'Pengeluaran' AND tb_kategori.user_id = ?`,
      [userId]
    );

    const saldo = (totalPemasukan[0].total || 0) - (totalPengeluaran[0].total || 0);

    // ✅ Cek apakah nominal melebihi saldo
    const nominal = parseFloat(jumlah);
    if (nominal > saldo) {
      return res.status(400).json({ message: "Saldo tidak mencukupi untuk pengeluaran ini." });
    }

    // 3. Simpan kategori
    const [kategori] = await db.execute(`INSERT INTO tb_kategori(nama_kategori, tipe, user_id) VALUES (?, ?, ?)`, [nama_kategori, tipe, userId]);
    const idKategori = kategori.insertId;

    // 4. Simpan transaksi
    await db.execute(`INSERT INTO tb_transaksi(kategori_id, tanggal, tipe, jumlah, metode_pembayaran, deskripsi, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`, [idKategori, tanggal, tipe, jumlah, metode_pembayaran, deskripsi, created_at]);

    res.status(200).json({ message: "Pengeluaran berhasil disimpan." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server", error: err.message });
  }
};

exports.postTransaksi = async (req, res) => {
  try {
    const { user_id, kategori_id, tipe, jumlah, deskripsi, tanggal, metode_pembayaran } = req.body;
    const created_at = new Date();
    const sql = "INSERT INTO tb_transaksi(user_id,kategori_id,tipe,jumlah,deskripsi,tanggal,metode_pembayaran,created_at) VALUES(?,?,?,?,?,?,?,?)";
    const [fields] = await db.execute(sql, [user_id, kategori_id, tipe, jumlah, deskripsi, tanggal, metode_pembayaran, created_at]);
    const data = {
      isSuccess: fields.affectedRows,
      id: fields.insertId,
    };
    response(200, data, "data berhasil ditambah", res);
  } catch (err) {
    response(500, err, "data gagal ditambah", res);
  }
};

exports.putTransaksi = async (req, res) => {
  try {
    const { tipe, jumlah, deskripsi, tanggal, id } = req.body;
    const sql = "UPDATE tb_transaksi SET tipe =?,jumlah = ?,deskripsi = ?,tanggal = ?, metode_pembayaran = ? WHERE id = ?";
    const [fields] = await db.execute(sql, [tipe, jumlah, deskripsi, tanggal, metode_pembayaran, id]);
    const data = {
      isSuccess: fields.affectedRows,
      id: fields.insertId,
    };
    response(200, data, "updata data berhasil", res);
  } catch (err) {
    response(500, err, "updata data gagal", res);
  }
};

exports.deleteTransaksi = async (req, res) => {
  try {
    const { id } = req.body;
    const sql = "DELETE FROM tb_transaksi WHERE id = ?";
    const [result] = db.execute(sql, [id]);
    response(200, result, "hapus berhasil", res);
  } catch (err) {
    response(500, err, "hapus gagal", res);
  }
};
