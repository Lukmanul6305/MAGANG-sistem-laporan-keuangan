const  { DataTypes } = require("sequelize")
const db = require("../../database/sequelize")

const user = db.define("tb_users",{
    username :{
        type : DataTypes.STRING,
    },
    email :{
        type : DataTypes.STRING,
    },
    password :{
        type : DataTypes.STRING,
    },
    refresh_token :{
        type : DataTypes.TEXT,
    },
},{
    freezeTableName:true,
})

module.exports = user