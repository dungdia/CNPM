module.exports = async (req, res) => {
    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();

        const getPermission = await conn.select(`
            SELECT * 
            FROM quyen q  
        `)
        const data = getPermission.map((row) => ({
            id: row.id_quyen,
            ten_quen: row.ten_quen,
            trangthai: row.trangthai
        }))
        res.json(data)
    } catch (error) {
        console.log(error);
    }
}