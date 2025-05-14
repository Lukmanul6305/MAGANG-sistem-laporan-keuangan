const db = require("../../database/connection");
const response = require("../utils/response");

exports.getAllUsers = async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM tb_users");
    response(200, result, "data berhasil ditampilkan", res);
  } catch (err) {
    console.log(err);
    response(500, null, "data gagal ditampilkan", res);
  }
};

exports.postUsers = async (req,res)=>{
  try{
    const {username,email,password	} = req.body
    const created_at = new Date()
    const sql = "INSERT INTO tb_users(username,email,password,created_at) VALUES(?,?,?,?)";
    const [result] = await db.execute(sql,[username,email,password,created_at])
    const data = {
      isSuccess : result.affectedRows,
      id : result.insertId
    }
    response(200, data, "Berhasil", res);
  }catch(err){
    response(500, null, err.message, res);

  }
}
