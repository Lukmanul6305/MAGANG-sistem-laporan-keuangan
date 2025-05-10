const express = require("express")
const app = express()
const port = 3000
const db = require("../database/connection")
const response = require("./response")
app.use(express.json())

app.get("/",(req,res)=>{
    const sql = `SHOW TABLES`
    db.query(sql,(err,fields)=>{
        response(200,fields,"nama tabel",res)
    })
})

app.post("/kategori",(req,res)=>{
    const {user_id,nama_kategori,tipe} = req.body;
    const sql = `INSERT INTO tb_kategori(user_id,nama_kategori,tipe) VALUES(?,?,?)`;
    db.query(sql,[user_id,nama_kategori,tipe],(err,fields)=>{
        if(err){
            response(500,fields,"data gagal",res)
        }else{
            const data = {
                isSuccess : fields.affectedRows,
                id : fields.insertId
            }
            response(200,data,"success",res)
        }
    });
})

app.listen(port,()=>{
    console.log(`website conneted port ${port}`)
})
