const formatDate = require('../../../../utils/formatDate');
module.exports = async (req, res) => {
    try {
        const DBConnecter = require("../../../controller/DBconnecter.js");
        const conn = new DBConnecter();

        // TODO: 
        const query = await conn.select(`
            SELECT *
            FROM taikhoan tk
            join vaitro vt on vt.id_vaitro = tk.vaitro_id and vt.id_vaitro != 1 
            join nhanvien nv on nv.id_taikhoan = tk.id_taikhoan
        `)
        const data = []
        for (const item of query) {
            data.push({
                id_taikhoan: item.id_taikhoan,
                id_nhanvien: item.id_nhanvien,
                user_name: item.user_name,
                ho_ten: item.ho_ten,
                ten_vaitro: item.ten_vaitro,
                ngaythamgia: formatDate(item.ngaythamgia),
                trangthai: item.trangthai
            })
        }
        return res.json(data);
    } catch (error) {
        res.send(error);
    }
}