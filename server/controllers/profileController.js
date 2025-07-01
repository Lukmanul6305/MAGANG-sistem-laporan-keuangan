const db = require('../../database/connection');
const response = require('../utils/response');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Ambil data profil lengkap user
const getFullProfileData = async (userId) => {
    const sql = `
        SELECT
            u.id, u.username, u.email, u.nomer, u.alamat, u.ulangTahun, u.deskripsi, u.foto_profil,
            IFNULL((SELECT SUM(t.jumlah) FROM tb_transaksi t WHERE t.user_id = u.id AND t.tipe = 'Pemasukan'), 0) AS totalPemasukan,
            IFNULL((SELECT SUM(t.jumlah) FROM tb_transaksi t WHERE t.user_id = u.id AND t.tipe = 'Pengeluaran'), 0) AS totalPengeluaran
        FROM tb_users u
        WHERE u.id = ?;
    `;
    const [rows] = await db.query(sql, [userId]);
    return rows[0];
};

exports.getProfile = async (req, res) => {
    const { userId } = req.params;

    if (!/^\d+$/.test(userId)) {
        return response(400, null, "Format User ID tidak valid.", res);
    }

    try {
        const profileData = await getFullProfileData(userId);
        if (!profileData) {
            return response(404, null, "User tidak ditemukan", res);
        }

        return response(200, profileData, "Profil berhasil diambil", res);
    } catch (error) {
        console.error("Error saat mengambil profil:", error);
        return response(500, null, "Terjadi kesalahan pada server", res);
    }
};

exports.updateProfile = async (req, res) => {
    const { userId } = req.params;
    const { username, nomer, alamat, ulangTahun, deskripsi } = req.body;

    let fotoPath = null;
    if (req.file) {
        fotoPath = req.file.path;
    }

    try {
        let setClauses = [];
        let params = [];

        if (username) { setClauses.push("username = ?"); params.push(username); }
        if (nomer) { setClauses.push("nomer = ?"); params.push(nomer); }
        if (alamat) { setClauses.push("alamat = ?"); params.push(alamat); }
        if (ulangTahun) { setClauses.push("ulangTahun = ?"); params.push(ulangTahun); }
        if (deskripsi) { setClauses.push("deskripsi = ?"); params.push(deskripsi); }

        if (req.file) {
            const relativePath = path.join('/uploads', req.file.filename);
            setClauses.push("foto_profil = ?");
            params.push(relativePath);
        }

        if (setClauses.length === 0) {
            if (fotoPath) fs.unlinkSync(fotoPath);
            return response(400, null, "Tidak ada data valid untuk diperbarui", res);
        }

        params.push(userId);
        const sql = `UPDATE tb_users SET ${setClauses.join(', ')} WHERE id = ?`;
        const [result] = await db.execute(sql, params);

        if (result.affectedRows === 0) {
            return response(404, null, "User tidak ditemukan untuk diperbarui", res);
        }

        const updatedProfileData = await getFullProfileData(userId);
        return response(200, updatedProfileData, "Profil berhasil diperbarui", res);
    } catch (error) {
        if (fotoPath) {
            fs.unlink(fotoPath, (err) => {
                if (err) console.error("Gagal menghapus file profil:", err);
            });
        }

        console.error("Error saat update profil:", error);

        if (error.code === 'ER_DUP_ENTRY') {
            return response(409, null, "Username sudah digunakan oleh pengguna lain", res);
        }

        return response(500, null, "Terjadi kesalahan server saat memperbarui profil", res);
    }
};

exports.changePassword = async (req, res) => {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!/^\d+$/.test(userId)) {
        return response(400, null, "Format User ID tidak valid.", res);
    }

    if (!currentPassword || !newPassword) {
        return response(400, null, "Password lama dan baru harus diisi.", res);
    }

    try {
        const [rows] = await db.query('SELECT password FROM tb_users WHERE id = ?', [userId]);
        if (rows.length === 0) {
            return response(404, null, 'User tidak ditemukan.', res);
        }
        
        const isMatch = await bcrypt.compare(currentPassword, rows[0].password);
        if (!isMatch) {
            return response(401, null, 'Password saat ini yang Anda masukkan salah.', res);
        }
        
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);
        
        await db.execute('UPDATE tb_users SET password = ? WHERE id = ?', [newHashedPassword, userId]);
        
        response(200, null, 'Password berhasil diubah.', res);

    } catch (error) {
        console.error("Error saat mengubah password:", error);
        response(500, null, 'Terjadi kesalahan server saat mengubah password.', res);
    }
};