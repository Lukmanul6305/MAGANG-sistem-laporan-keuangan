const db = require("../../database/connection")
const response = require("../utils/response")


exports.postKatagori = async (req,res)=>{
    try{
        const {user_id,nama_kategori,tipe} = req.body
        const sql = "INSERT INTO tb_kategori(user_id,nama_kategori,tipe) VALUES(?,?,?)";
        const [fields] = await db.execute(sql,[user_id,nama_kategori,tipe]);
        const data = {
            isSuccess : fields.affectedRows,
            id : fields.insertId
        }
        response(200,data,"valid add data",res)
    }catch(err){
        response(200,err,"valid add data",res)

    }
}

exports.putKategori = async (req,res)=>{
    try{
        const {nama_kategori,tipe,id} = req.body
        const sql = "UPDATE tb_kategori SET nama_kategori = ?,tipe = ? WHERE id = ?";
        const [fields] = await db.execute(sql,[nama_kategori,tipe,id])
        response(200,fields,"data berhasil diperbarui",res)
    }catch(err){
        response(500,null,err,res)

    }
}

exports.deleteKategori = async (req,res)=>{
    try{
        const {id} = req.body
        const sql = "DELETE FROM tb_Kategori WHERE id = ?"
        const [result] = await db.execute(sql,[id])
        response(200,result,"sukses",res)
    }catch(err){
        response(500,err,"gagal",res)
    }
}

exports.getCategoriesByUser = async (req, res) => {
    try {
        const { userId } = req.params; // Ambil userId dari parameter URL

        if (!userId) {
            return response(400, null, "User ID diperlukan.", res);
        }

        // Query untuk mengambil semua kategori unik milik seorang user
        const sql = "SELECT id, nama_kategori, tipe FROM tb_kategori WHERE user_id = ?";
        const [categories] = await db.query(sql, [userId]);

        // Kirim data kategori sebagai respons
        response(200, categories, "Daftar kategori berhasil diambil.", res);

    } catch (err) {
        console.error("Error getting categories:", err);
        response(500, null, `Terjadi kesalahan server: ${err.message}`, res);
    }
};