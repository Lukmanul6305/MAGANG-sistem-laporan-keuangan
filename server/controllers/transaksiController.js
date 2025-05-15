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
