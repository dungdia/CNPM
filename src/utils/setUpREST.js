const getAllFile = require("./getAllFile")
const path = require("path")

function requestHandler(app,list,parent,type){

    //tạo ra route tương ứng với đường dẫn `/api/${parent}/${name}
    for(const Method of list){
        //folder là từng folder trong folder api
        //vd: D:\Project\Web\CNPM\src\app\api\${parent}\${filename}.js
        //split để thành mảng, pop để lấy ra tên file
        const apiName = Method.split("/").pop().replace(".js","") 
        //import callback từ file vào
        const apiCallback = require(Method)

        //tạo ra response của get với call back dc viết trong file
        if(type == 'GET')
            app.get(`/api/${parent}/${apiName}`,apiCallback)
        if(type =='POST')
            app.post(`/api/${parent}/${apiName}`,apiCallback)
        if(type == 'PUT')
            app.put(`/api/${parent}/${apiName}`,apiCallback)
        if(type == 'DELETE')
            app.delete(`/api/${parent}/${apiName}`,apiCallback)
    }
}

module.exports = async (app,apiDir,parent) =>{
    const folderDir = await getAllFile(path.join(apiDir,parent))
    //fileDir chứ 4 folder ứng với thứ tự [DELETE,GET,POST,PUT]

    for(const folder of folderDir){

        const type = folder.split("/").pop()
        
        const fileList = await getAllFile(folder)
        
        requestHandler(app,fileList,parent,type)
    }
}