const db = require("../../database/connection")
const response = require("../utils/response")

exports.postLaporan = async (req,res)=>{
    try{
        const {user_id,jenis_laporan,periode_awal,priode_akhir,format} = req.body;
        const generated_at = new Date()
        const sql = "INSERT INTO tb_laporan(user_id,jenis_laporan,periode_awal,priode_akhir,format,generated_at) VALUES(?,?,?,?,?,?)";
        const [fields] = await db.execute(sql,[user_id,jenis_laporan,periode_awal,priode_akhir,format,generated_at])
        const data = {
            isSuccess : fields.affectedRows,
            id : fields.insertId
        }
        response(200,data,"sukses",res)
    }catch(err){
        response(500,err.message,"gagal",res)

    }
}


exports.putLaporan = async (req,res)=>{
    try{
        const {jenis_laporan,periode_awal,priode_akhir,format,id}  = req.body
        const sql = "UPDATE tb_laporan SET jenis_laporan = ?,periode_awal = ?,priode_akhir = ?,format = ? WHERE id = ?"
        const [fields] = await db.execute(sql,[jenis_laporan,periode_awal,priode_akhir,format,id])
        const data = {
            isSuccess : fields.affectedRows,
            id : fields.insertId
        }
        response(200,data,"sukses",res)
    }catch(err){
        response(500,err.message,"gagal",res)

    }
}

exports.deletelaporan = async (req,res)=>{
    try{
        const {id} = req.body
        const sql = "DELETE FROM tb_laporan WHERE id = ?"
        const [result] = await db.execute(sql,[id])
        response(200,result,"sukses",res)
    }catch(err){
        response(500,err,"gagal",res)
    }
}

exports.getLaporanSummary = async (req, res) => {
    try {
        const { userId } = req.params;
        const { periode_awal, periode_akhir } = req.query;

        if (!userId) {
            return response(400, null, "User ID diperlukan", res);
        }

        // 1. Ambil Saldo dari tabel user
        const [user] = await db.query("SELECT saldo FROM tb_users WHERE id = ?", [userId]);
        const totalSaldo = user.length > 0 ? user[0].saldo : 0;

        // 2. Siapkan query untuk Pemasukan dan Pengeluaran dengan filter tanggal
        let pemasukanQuery = "SELECT SUM(jumlah) as total FROM tb_transaksi WHERE user_id = ? AND tipe = 'Pemasukan'";
        let pengeluaranQuery = "SELECT SUM(jumlah) as total FROM tb_transaksi WHERE user_id = ? AND tipe = 'Pengeluaran'";
        const params = [userId];

        if (periode_awal && periode_akhir) {
            pemasukanQuery += " AND tanggal BETWEEN ? AND ?";
            pengeluaranQuery += " AND tanggal BETWEEN ? AND ?";
            params.push(periode_awal, periode_akhir);
        }

        // Eksekusi query pemasukan & pengeluaran
        const [pemasukanResult] = await db.query(pemasukanQuery, params);
        const [pengeluaranResult] = await db.query(pengeluaranQuery, params);

        const totalPemasukan = pemasukanResult[0].total || 0;
        const totalPengeluaran = pengeluaranResult[0].total || 0;
        
        const payload = {
            totalSaldo,
            totalPemasukan,
            totalPengeluaran,
        };

        response(200, payload, "Ringkasan laporan berhasil diambil", res);

    } catch (err) {
        console.error("Error getting report summary:", err);
        response(500, null, `Terjadi kesalahan server: ${err.message}`, res);
    }
};


// Endpoint untuk mendapatkan daftar transaksi yang sudah difilter
exports.getLaporanTransaksi = async (req, res) => {
    try {
        const { userId } = req.params;
        const { tipe, periode_awal, periode_akhir } = req.query;

        let sql = `
            SELECT t.id, t.tanggal, t.tipe AS jenis, k.nama_kategori AS kategori, t.jumlah AS nominal, t.metode_pembayaran AS metode, t.deskripsi AS keterangan
            FROM tb_transaksi t
            LEFT JOIN tb_kategori k ON t.kategori_id = k.id
            WHERE t.user_id = ?
        `;
        const params = [userId];

        if (tipe) {
            sql += " AND t.tipe = ?";
            params.push(tipe);
        }
        if (periode_awal && periode_akhir) {
            sql += " AND t.tanggal BETWEEN ? AND ?";
            params.push(periode_awal, periode_akhir);
        }

        sql += " ORDER BY t.tanggal DESC";
        
        const [transactions] = await db.query(sql, params);

        response(200, transactions, "Data transaksi untuk laporan berhasil diambil", res);

    } catch (err) {
        console.error("Error getting report transactions:", err);
        response(500, null, `Terjadi kesalahan server: ${err.message}`, res);
    }
};

// Endpoint untuk menyimpan histori generate laporan
exports.generateLaporan = async (req, res) => {
    try {
        const { userId } = req.params;
        const { jenis_laporan, periode_awal, periode_akhir, format } = req.body;

        // Di sini Anda bisa menambahkan logika untuk membuat file PDF/Excel
        // Untuk saat ini, kita hanya akan menyimpan record ke database
        
        const sql = "INSERT INTO tb_laporan (user_id, jenis_laporan, periode_awal, periode_akhir, format) VALUES (?, ?, ?, ?, ?)";
        const [result] = await db.query(sql, [userId, jenis_laporan, periode_awal, periode_akhir, format]);

        // TODO: Buat file PDF/Excel dan kirim linknya
        
        response(201, { id: result.insertId, message: "Laporan berhasil dibuat dan dicatat." }, "Laporan berhasil dibuat", res);
        
    } catch (err) {
        console.error("Error generating report:", err);
        response(500, null, `Terjadi kesalahan server: ${err.message}`, res);
    }
};

// ... (fungsi controller lainnya) ...

// BARU: Endpoint untuk data chart mingguan
exports.getWeeklyChartData = async (req, res) => {
    try {
        const { userId } = req.params;
        const { periode_awal, periode_akhir } = req.query;

        if (!userId || !periode_awal || !periode_akhir) {
            return response(400, null, "User ID dan periode diperlukan", res);
        }

        // Query ini akan mengelompokkan transaksi per minggu dan menjumlahkannya
        const sql = `
            SELECT 
                WEEK(tanggal, 1) AS minggu,
                SUM(CASE WHEN tipe = 'Pemasukan' THEN jumlah ELSE 0 END) AS total_pemasukan,
                SUM(CASE WHEN tipe = 'Pengeluaran' THEN jumlah ELSE 0 END) AS total_pengeluaran
            FROM tb_transaksi
            WHERE user_id = ? AND tanggal BETWEEN ? AND ?
            GROUP BY minggu
            ORDER BY minggu ASC;
        `;
        const params = [userId, periode_awal, periode_akhir];
        const [weeklyData] = await db.query(sql, params);

        response(200, weeklyData, "Data chart mingguan berhasil diambil", res);

    } catch (err) {
        console.error("Error getting weekly chart data:", err);
        response(500, null, `Terjadi kesalahan server: ${err.message}`, res);
    }
};
