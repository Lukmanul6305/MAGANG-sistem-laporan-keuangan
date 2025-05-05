const express = require("express")
const db = require("../database/connection")

const app = express()
const port = 3000
const mysql = "SHOW TABLES";
const values = {id,username,email,password,created_at}

app.use(express.json())


app.get("/",(req,res)=>{
    db.query(mysql,(err,result)=>{
        res.json(result)
    })
})
app.get("/users",(req,res)=>{
    db.query(`SELECT * FROM tb_users`,(err,result)=>{
        res.json(result)
    })
})

app.post("/users",(err,res)=>{
    db.query(`INSERT INTO tb_user values(?,?,?,?,?)`,values,(err,result)=>{
        
    })
})

app.listen(port,(req,res)=>{
    console.log(`web running in port ${3000}`)
})