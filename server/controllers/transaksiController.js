const db = require("../../database/connection");
const response = require("../utils/response");

exports.getTransaksiSaldo = async (req, res) => {
  try {
    // Ambil user_id dari query parameter
    const { user_id } = req.query;

    // Tambahkan validasi dasar untuk user_id
    if (!user_id) {
      return res.status(400).json({ message: "User ID diperlukan." });
    }

    const [result] = await db.query(
      `
            SELECT
                SUM(CASE WHEN tipe = 'Pemasukan' THEN jumlah ELSE 0 END) AS total_pemasukan,
                SUM(CASE WHEN tipe = 'Pengeluaran' THEN jumlah ELSE 0 END) AS total_pengeluaran,
                SUM(CASE WHEN tipe = 'Pemasukan' THEN jumlah ELSE 0 END) -
                SUM(CASE WHEN tipe = 'Pengeluaran' THEN jumlah ELSE 0 END) AS total_saldo
            FROM tb_transaksi
            WHERE user_id = ?
            `,
      [user_id]
    );
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTransaksiExpens = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ message: "User ID diperlukan." });
    }
    const [result] = await db.query(
      `SELECT SUM(jumlah) AS total_pengeluaran FROM tb_transaksi WHERE tipe = 'Pengeluaran' AND user_id = ?`,
      [user_id]
    );
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTransaksiIncomes = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ message: "User ID diperlukan." });
    }
    const [result] = await db.query(
      `SELECT SUM(jumlah) AS total_pemasukan FROM tb_transaksi WHERE tipe = 'Pemasukan' AND user_id = ?`,
      [user_id]
    );
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTransaksiBulanan = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ message: "User ID diperlukan." });
    }
    const [result] = await db.query(
      `
            SELECT
                DATE_FORMAT(tanggal, '%Y-%m') AS bulan,
                SUM(CASE WHEN tipe = 'Pemasukan' THEN jumlah ELSE 0 END) AS total_pemasukan,
                SUM(CASE WHEN tipe = 'Pengeluaran' THEN jumlah ELSE 0 END) AS total_pengeluaran
            FROM tb_transaksi
            WHERE user_id = ?
            GROUP BY DATE_FORMAT(tanggal, '%Y-%m')
            ORDER BY bulan
            `,
      [user_id]
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fungsi postTransaksi sudah baik, tetapi pastikan user_id juga berasal dari sesi otentikasi yang aman
exports.postTransaksi = async (req, res) => {
  try {
    const { user_id, kategori_id, tipe, jumlah, deskripsi, tanggal, metode_pembayaran } = req.body;
    const created_at = new Date();
    const sql =
      "INSERT INTO tb_transaksi(user_id,kategori_id,tipe,jumlah,deskripsi,tanggal,metode_pembayaran,created_at) VALUES(?,?,?,?,?,?,?,?)";
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

exports.IPemasukan = async (req, res) => {
  try {
    const { user_id, tanggal, tipe, jumlah, nama_kategori, metode_pembayaran, deskripsi } = req.body;
    const created_at = new Date();

    console.log("Data diterima dari frontend:", { user_id, tanggal, tipe, jumlah, nama_kategori, metode_pembayaran, deskripsi });

    // Validasi dasar: Pastikan user_id ada
    if (!user_id) {
      console.error("Error: User ID tidak ditemukan dalam permintaan body.");
      return res.status(400).json({ message: "User ID tidak ditemukan dalam permintaan." });
    }
    // Validasi lain seperti yang sudah ada
    if (!tanggal || !tipe || !jumlah || !nama_kategori || !metode_pembayaran) {
        return res.status(400).json({ message: "Semua field wajib diisi (kecuali deskripsi)." });
    }

    let kategori_id;

    // Cek kategori
    console.log(`Mencari kategori: nama_kategori=${nama_kategori}, tipe=${tipe}, user_id=${user_id}`);
    const [existingKategoriRows] = await db.query(
      `SELECT id FROM tb_kategori WHERE nama_kategori = ? AND tipe = ? AND user_id = ?`, // Menambahkan user_id ke klausa WHERE
      [nama_kategori, tipe, user_id] // Menambahkan user_id sebagai parameter
    );
    console.log("Hasil pencarian kategori:", existingKategoriRows);

    if (existingKategoriRows.length > 0) {
      kategori_id = existingKategoriRows[0].id;
      console.log("Kategori ditemukan, ID:", kategori_id);
    } else {
      console.log("Kategori tidak ditemukan, membuat baru...");
      // --- PERUBAHAN DI SINI: Tambahkan user_id ke INSERT tb_kategori ---
      const [newKategoriResult] = await db.execute(
        `INSERT INTO tb_kategori(nama_kategori, tipe, user_id) VALUES (?,?,?)`, // Menambahkan kolom user_id
        [nama_kategori, tipe, user_id] // Menambahkan user_id sebagai nilai
      );
      // ------------------------------------------------------------------
      kategori_id = newKategoriResult.insertId;
      console.log("Kategori baru dibuat, ID:", kategori_id);
    }

    // Tambahkan transaksi
    console.log("Menyimpan transaksi:", { user_id, kategori_id, tanggal, tipe, jumlah, metode_pembayaran, deskripsi, created_at });
    const sqlTransaksi = `
            INSERT INTO tb_transaksi(user_id, kategori_id, tanggal, tipe, jumlah, metode_pembayaran, deskripsi, created_at)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?)
        `;
    const [transaksiResult] = await db.execute(sqlTransaksi, [
      user_id,
      kategori_id,
      tanggal,
      tipe,
      jumlah,
      metode_pembayaran,
      deskripsi,
      created_at,
    ]);
    console.log("Hasil penyimpanan transaksi:", transaksiResult);

    if (transaksiResult.affectedRows > 0) {
      response(200, { id: transaksiResult.insertId }, "Pemasukan berhasil disimpan!", res);
    } else {
      response(500, null, "Gagal menyimpan pemasukan ke database.", res);
    }
  } catch (err) {
    console.error("GLOBAL ERROR di IPemasukan:", err);
    response(500, null, `Gagal menyimpan data: ${err.message}`, res);
  }
};
    
exports.IPengeluaran = async (req, res) => {
  try {
    // Ambil data dari body request, termasuk user_id
    const { user_id, tanggal, tipe, jumlah, nama_kategori, metode_pembayaran, deskripsi } = req.body;
    const created_at = new Date();

    // Validasi dasar: Pastikan semua field yang wajib ada dan user_id juga ada
    if (!user_id || !tanggal || !tipe || !jumlah || !nama_kategori || !metode_pembayaran) {
      return response(400, null, "Semua field wajib diisi (kecuali deskripsi) dan user ID diperlukan.", res);
    }

    const nominalPengeluaran = parseFloat(jumlah); // Pastikan jumlah adalah angka

    // 1. Hitung total pemasukan untuk user_id ini
    const [pemasukanResult] = await db.query(
      `SELECT SUM(jumlah) AS total FROM tb_transaksi WHERE user_id = ? AND tipe = 'Pemasukan'`,
      [user_id]
    );
    const totalPemasukan = pemasukanResult[0].total || 0; // Pastikan default 0 jika null

    // 2. Hitung total pengeluaran untuk user_id ini
    const [pengeluaranResult] = await db.query(
      `SELECT SUM(jumlah) AS total FROM tb_transaksi WHERE user_id = ? AND tipe = 'Pengeluaran'`,
      [user_id]
    );
    const totalPengeluaran = pengeluaranResult[0].total || 0; // Pastikan default 0 jika null

    const saldoSaatIni = totalPemasukan - totalPengeluaran;

    // ✅ Cek apakah nominal pengeluaran melebihi saldo saat ini
    if (nominalPengeluaran > saldoSaatIni) {
      return response(400, null, "Saldo tidak mencukupi untuk pengeluaran ini.", res);
    }

    let kategori_id;

    // 3. Cek atau buat kategori, pastikan kategori terikat user_id
    const [existingKategoriRows] = await db.query(
      `SELECT id FROM tb_kategori WHERE nama_kategori = ? AND tipe = ? AND user_id = ?`,
      [nama_kategori, tipe, user_id]
    );

    if (existingKategoriRows.length > 0) {
      kategori_id = existingKategoriRows[0].id;
    } else {
      const [newKategoriResult] = await db.execute(
        `INSERT INTO tb_kategori(nama_kategori, tipe, user_id) VALUES (?,?,?)`,
        [nama_kategori, tipe, user_id]
      );
      kategori_id = newKategoriResult.insertId;
    }

    // 4. Simpan transaksi pengeluaran
    const sqlTransaksi = `
            INSERT INTO tb_transaksi(user_id, kategori_id, tanggal, tipe, jumlah, metode_pembayaran, deskripsi, created_at)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?)
        `;
    const [transaksiResult] = await db.execute(sqlTransaksi, [
      user_id,
      kategori_id,
      tanggal,
      tipe,
      nominalPengeluaran, // Gunakan nominalPengeluaran yang sudah di-parse float
      metode_pembayaran,
      deskripsi,
      created_at,
    ]);

    if (transaksiResult.affectedRows > 0) {
      response(200, { id: transaksiResult.insertId }, "Pengeluaran berhasil disimpan!", res);
    } else {
      response(500, null, "Gagal menyimpan pengeluaran ke database.", res);
    }
  } catch (err) {
    console.error("GLOBAL ERROR di IPengeluaran:", err);
    response(500, null, `Terjadi kesalahan server: ${err.message}`, res);
  }
};