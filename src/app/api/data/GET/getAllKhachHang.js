const formatDate = require('../../../../utils/formatDate.js');
module.exports = async (req, res) => {
    try {
        const DBConnecter = require("../../../controller/DBconnecter.js");
        const conn = new DBConnecter();

        const query = await conn.select(`
            SELECT *
            FROM taikhoan tk
            join vaitro vt on vt.id_vaitro = tk.vaitro_id 
            join khachhang kh on kh.id_taikhoan = tk.id_taikhoan 
        `)
        const data = []
        for (const item of query) {
            data.push({
                id_khachhang: item.id_khachhang,
                id_taikhoan: item.id_taikhoan,
                user_name: item.user_name,
                ho_ten: item.ho_ten,
                ngaythamgia: formatDate(item.ngaythamgia),
                trangthai: item.trangthai
            })
        }
        return res.json(data);
    } catch (error) {
        res.send(error);
    }
}