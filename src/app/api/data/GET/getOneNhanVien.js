const formatDate = require('../../../../utils/formatDate');
module.exports = async (req, res) => {
    const { id_nhanvien } = req.query
    console.log(id_nhanvien)
    try {
        const DBConnecter = require("../../../controller/DBconnecter.js");
        const conn = new DBConnecter();

        const getOneNhanVien = await conn.select(`
            SELECT *
            FROM taikhoan tk
            join vaitro vt on vt.id_vaitro = tk.vaitro_id and vt.id_vaitro != 1 
            join nhanvien nv on nv.id_taikhoan = tk.id_taikhoan
            where nv.id_nhanvien = ?
        `, [id_nhanvien])
        for (const item of getOneNhanVien) {
            item.ngaythamgia = formatDate(item.ngaythamgia)
        }
        conn.closeConnect()
        return res.json(getOneNhanVien);
    } catch (error) {
        res.send(error);
    }
}