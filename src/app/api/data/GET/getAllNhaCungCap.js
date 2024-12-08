module.exports = async (req,res)=>{
    try {
        const DBConnecter = require("../../../controller/DBconnecter")
        const conn = new DBConnecter()
        const result = await conn.select(`SELECT * FROM nhacungcap`)
        res.json(result)
        conn.closeConnect()
    } catch (error) {
        console.log(error)
    }
}