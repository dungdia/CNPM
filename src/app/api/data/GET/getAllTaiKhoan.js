const formatDate = require('../../../../utils/formatDate');
module.exports = async (req, res) => {
    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();
        const getAllTK = await conn.select(`
            select * 
            from taiKhoan tk
            left outer join vaitro vt on tk.vaitro_id = vt.id_vaitro
        `);
        const data = [];
        for (const item of getAllTK) {
            data.push({
                id_taikhoan: item.id_taikhoan,
                user_name: item.user_name,
                ho_ten: item.ho_ten,
                ngaythamgia: formatDate(item.ngaythamgia),
                trangthai: item.trangthai,
                ten_vaitro: item.ten_vaitro
            })
        }
        conn.closeConnect();
        res.json(data);
    } catch (error) {
        res.send(error);
    }
}