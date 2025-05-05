const mysql = require("mysql")


const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"sistem_laporan_keuangan"
})


connection.connect((err)=>{
    if(err) throw err;
    console.log('Connected to mysql')
})

module.exports = connection