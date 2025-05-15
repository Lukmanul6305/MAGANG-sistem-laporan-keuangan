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