const db = require("../../database/connection")
const response = require("../utils/response")

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