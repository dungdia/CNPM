const fs = require("fs")
const path = require('path')

module.exports = async (directory) =>{
    const files = fs.readdirSync(directory)

    const fileName = []

    for(const file of files){
        fileName.push(path.join(directory,file))
    }
    return fileName
}