// Nama file: controllers/profileController.js

const db = require('../../database/connection'); // Sesuaikan path ini jika perlu
const response = require('../utils/response'); // Sesuaikan path ini jika perlu
const bcrypt = require('bcryptjs');

// Mengambil data profil lengkap
exports.getProfile = async (req, res) => {
    const { userId } = req.params;
    if (!userId) return response(400, null, "User ID diperlukan.", res);

    try {
        // --- PERBAIKAN DI DALAM QUERY SQL ---
        // Mengubah t.tipe menjadi t.jenis dan t.jumlah menjadi t.nominal
        const sql = `
            SELECT
                u.id, u.username, u.email, u.nomer, u.alamat, u.ulangTahun, u.deskripsi, u.foto_profil,
                (SELECT SUM(IF(t.jenis = 'Pemasukan', t.nominal, 0)) FROM tb_transaksi t WHERE t.user_id = u.id) AS totalPemasukan,
                (SELECT SUM(IF(t.jenis = 'Pengeluaran', t.nominal, 0)) FROM tb_transaksi t WHERE t.user_id = u.id) AS totalPengeluaran
            FROM tb_users u
            WHERE u.id = ?;
        `;
        const [rows] = await db.query(sql, [userId]);
        
        if (rows.length === 0) {
            return response(404, null, 'User tidak ditemukan', res);
        }
        
        // Mengirim data langsung, frontend akan menangani 'payload' jika ada
        response(200, rows[0], 'Profil berhasil diambil', res);

    } catch (error) {
        console.error("Error saat mengambil profil:", error);
        response(500, null, 'Terjadi kesalahan pada server', res);
    }
};

// Memperbarui profil (termasuk foto)
exports.updateProfile = async (req, res) => {
    const { userId } = req.params;
    const { username, nomer, alamat, ulangTahun, deskripsi } = req.body;
    try {
        let setClauses = [];
        let params = [];
        if (username) { setClauses.push("username = ?"); params.push(username); }
        if (nomer) { setClauses.push("nomer = ?"); params.push(nomer); }
        if (alamat) { setClauses.push("alamat = ?"); params.push(alamat); }
        if (ulangTahun) { setClauses.push("ulangTahun = ?"); params.push(ulangTahun); }
        if (deskripsi) { setClauses.push("deskripsi = ?"); params.push(deskripsi); }
        
        if (req.file) {
            const fotoPath = `/${req.file.filename}`;
            setClauses.push("foto_profil = ?");
            params.push(fotoPath);
        }
        
        if (setClauses.length === 0) return response(400, null, 'Tidak ada data valid untuk diupdate.', res);
        
        params.push(userId);
        const sql = `UPDATE tb_users SET ${setClauses.join(', ')} WHERE id = ?`;
        const [result] = await db.execute(sql, params);
        
        if (result.affectedRows === 0) return response(404, null, 'User tidak ditemukan untuk diupdate.', res);
        
        response(200, { updated: true }, 'Profil berhasil diperbarui.', res);
    } catch (error) {
        console.error("Error saat update profil:", error);
        response(500, null, 'Terjadi kesalahan server saat update profil.', res);
    }
};

// Mengganti password
exports.changePassword = async (req, res) => {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return response(400, null, "Password lama dan baru harus diisi.", res);
    try {
        const [rows] = await db.query('SELECT password FROM tb_users WHERE id = ?', [userId]);
        if (rows.length === 0) return response(404, null, 'User tidak ditemukan.', res);
        
        const isMatch = await bcrypt.compare(currentPassword, rows[0].password);
        if (!isMatch) return response(401, null, 'Password saat ini yang Anda masukkan salah.', res);
        
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);
        
        await db.execute('UPDATE tb_users SET password = ? WHERE id = ?', [newHashedPassword, userId]);
        response(200, null, 'Password berhasil diubah.', res);
    } catch (error) {
        console.error("Error saat mengubah password:", error);
        response(500, null, 'Terjadi kesalahan server saat mengubah password.', res);
    }
};