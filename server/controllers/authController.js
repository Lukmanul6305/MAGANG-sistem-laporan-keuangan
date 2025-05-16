const users = require("../models/userModel")
const bcrypt = require("bcrypt")
const db = require("../../database/connection") //ganti aja

const getUsers = async(req,res)=>{
    try{
        const user = await users.findAll();
        res.json(user)
    }catch(err){
        console.log(err)
    }
}

exports.Register = async(req,res)=>{
    const {username,email,password,confPassword} = req.body;
    if(password !== confPassword){
        return res.status(400).json({msg : "password tidak cocok"})
    }
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password,salt)
    try{
        const sql = "INSERT INTO tb_users(username,email,password) VALUES(?,?,?)";
        db.execute(sql,[username,email,hashPassword])
        res.send({msg:"Registrasi Berhasil"})
    }catch(err){
        console.log(err)
    }
}