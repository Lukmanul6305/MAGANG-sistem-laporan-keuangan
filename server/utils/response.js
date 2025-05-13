const response = (statusCode,data,pesan,res)=>{
    res.status(statusCode).json({
        payload : data,
        pesan,
        metadata:{
            prev:"",
            next:"",
            currend:""
        }
    })
}

module.exports = response