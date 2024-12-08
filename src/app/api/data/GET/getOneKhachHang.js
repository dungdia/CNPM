const formatDate = require('../../../../utils/formatDate.js');
module.exports = async (req, res) => {
    try {
        const { id_khachhang } = req.query
        const DBConnecter = require("../../../controller/DBconnecter.js");
        const conn = new DBConnecter();

        const query = await conn.select(`
            SELECT *
            FROM taikhoan tk
            join vaitro vt on vt.id_vaitro = tk.vaitro_id 
            join khachhang kh on kh.id_taikhoan = tk.id_taikhoan 
            where kh.id_khachhang = ?
        `, [id_khachhang])
        const data = []
        for (const item of query) {
            data.push(item)
        }
        return res.json(data);
    } catch (error) {
        res.send(error);
    }
}