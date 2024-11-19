module.exports = async (req,res,next)=>{
    const token = req.cookies.access_token
    const path = req.path.split("/")[1]

    if(!token){
        switch (path) {
            case 'api':
                res.send({message:"Lỗi xác thực không có token", success: false})
                break;
            default:
                res.redirect('/')
                break;
        }
        return
    }

    // console.log(token)
    // console.log(token)

    const jwt = require("./jwt")
    const result = await jwt.verifyToken(token,process.env.JWT_SECRET_KEY)
    if(!result){
        switch (path) {
            case 'api':
                res.send({message:"Lỗi xác thực token", success: false})
                break;
            default:
                res.redirect('/')
                break;
        }
        return
    }
    if(result.expire){
        switch (path) {
            case 'api':
                res.send({message:"Token hết hạn", success: false, expire: true })
                break;
            default:
                res.redirect('/')
                break;
        }
        return
    }
    next()  
}