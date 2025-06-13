const db = require("../../database/connection");
const response = require("../utils/response");
const bcrypt = require("bcrypt");

exports.getAllUsers = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM tb_users");
    response(200, result, "data berhasil ditampilkan", res);
  } catch (err) {
    console.log(err);
    response(500, null, "data gagal ditampilkan", res);
  }
};

exports.putUsers = async (req, res) => {
  try {
    const { username, email, password, id } = req.body;
    const sql = `UPDATE tb_users SET username = ?,email = ?,password = ? WHERE id = ?`;
    const [fields] = await db.execute(sql, [username, email, password, id]);
    const data = {
      isSuccess: fields.affectedRows,
      id: fields.insertId,
    };
    response(500, data, "update valid", res);
  } catch (err) {
    response(500, err.message, "update invalid", res);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.body;
    const [result] = await db.execute("DELETE FROM tb_users WHERE id = ?", [id]);
    const data = {
      isSuccess: result.affectedRows > 0,
      deletedCount: result.affectedRows,
    };

    response(200, data, "Data berhasil dihapus", res);
  } catch (err) {
    res.send(err);
    response(500, err, "data gagal dihapus", res);
  }
};

exports.putViaProfil = async (req, res) => {
    try {
        const { userId } = req.params; // Mengambil userId dari URL parameter
        // Tidak perlu cek req.session.userId lagi

        const { username, email, nomer, alamat, ulangTahun, deskripsi } = req.body;
        
        if (!username || !email) {
            return response(400, null, "Nama pengguna dan email tidak boleh kosong.", res);
        }

        const sqlUserUpdate = `UPDATE tb_users SET 
                                 username = ?, 
                                 email = ?, 
                                 nomer = ?,          
                                 alamat = ?,         
                                 ulangTahun = ?      
                                 WHERE id = ?`;
        
        const [resultUserUpdate] = await db.execute(sqlUserUpdate, [
            username,
            email,
            nomer,
            alamat,
            ulangTahun,
            userId
        ]);

        const [existingDescTxn] = await db.query(
            `SELECT id FROM tb_transaksi WHERE user_id = ? AND tipe = 'DeskripsiProfil' LIMIT 1`,
            [userId]
        );

        if (existingDescTxn.length > 0) {
            await db.execute(
                `UPDATE tb_transaksi SET description = ?, created_at = NOW() WHERE id = ?`,
                [deskripsi, existingDescTxn[0].id]
            );
        } else {
            await db.execute(
                `INSERT INTO tb_transaksi (user_id, amount, tipe, description, created_at) VALUES (?, ?, ?, ?, NOW())`,
                [userId, 0, 'DeskripsiProfil', deskripsi]
            );
        }
        
        if (resultUserUpdate.affectedRows === 0 && existingDescTxn.length === 0) {
            return response(200, { success: true, message: "Profil tidak ditemukan atau tidak ada perubahan." }, "Tidak ada perubahan", res);
        }
        
        response(200, { success: true, message: "Profil berhasil diperbarui." }, "Update berhasil", res);

    } catch (err) {
        console.error("Error updating user profile:", err);
        response(500, null, `Terjadi kesalahan server: ${err.message}`, res);
    }
};
