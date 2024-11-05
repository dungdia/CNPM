const getAllFile = require("./getAllFile")
const path = require("path")

async function authMiddleWare(req,res,next){
    const authorization = req.headers.authorization
    if(!authorization){
        res.send({message:"Lỗi xác thực không có token", success: false})
        return
    }
    const authType = authorization.slice(0,6)
    if(authType != "Bearer"){
        res.send({message:"Lỗi xác thực không đúng dạng xác thực", success: false})
        return
    }

    const token = authorization.slice(7,authorization.length)
    console.log(token)
    // console.log(token)

    const jwt = require("./jwt")
    const result = await jwt.verifyToken(token,process.env.JWT_SECRET_KEY)
    if(!result){
        res.send({message:"Lỗi xác thực token", success: false})
        return
    }
    if(result.expire){
        res.send({message:"Token hết hạn", success: false, expire: true })
        return
    }
    next()  
}

function requestHandler(app,list,parent,type){
    const authRoute = ["auth"]

    //tạo ra route tương ứng với đường dẫn `/api/${parent}/${name}
    for(const Method of list){
        //folder là từng folder trong folder api
        //vd: D:\Project\Web\CNPM\src\app\api\${parent}\${filename}.js
        //split để thành mảng, pop để lấy ra tên file
        const apiName = Method.split("\\").pop().replace(".js","") 
        //import callback từ file vào
        const apiCallback = require(Method)

        //tạo ra response của get với call back dc viết trong file
        if(type == 'GET'){
            if(authRoute.includes(parent)){
                app.get(`/api/${parent}/${apiName}`,authMiddleWare,apiCallback)
                // return
            }else
                app.get(`/api/${parent}/${apiName}`,apiCallback)
        }
        if(type =='POST'){
            if(authRoute.includes(parent)){
                app.post(`/api/${parent}/${apiName}`,authMiddleWare,apiCallback)
                // return
            }else
                app.post(`/api/${parent}/${apiName}`,apiCallback)
        }
        if(type == 'PUT'){
            if(authRoute.includes(parent)){
                app.put(`/api/${parent}/${apiName}`,authMiddleWare,apiCallback)
                // return
            }else
                app.put(`/api/${parent}/${apiName}`,apiCallback)
        }
        if(type == 'DELETE'){
            if(authRoute.includes(parent)){
                app.post(`/api/${parent}/${apiName}`,authMiddleWare,apiCallback)
                // return
            }else
                app.delete(`/api/${parent}/${apiName}`,apiCallback)
        }
    }
}

module.exports = async (app,apiDir,parent) =>{
    const folderDir = await getAllFile(path.join(apiDir,parent))
    //fileDir chứ 4 folder ứng với thứ tự [DELETE,GET,POST,PUT]

    for(const folder of folderDir){

        const type = folder.split("\\").pop()
        
        const fileList = await getAllFile(folder)
        
        requestHandler(app,fileList,parent,type)
    }
}