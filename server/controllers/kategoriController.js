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
