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
