const formateDate = require("../../../../utils/formatDate.js");
module.exports = async (req, res) => {
    try {
        const DBConnecter = require("../../../controller/DBconnecter.js");
        const conn = new DBConnecter();

        // TODO: 
        const taiKhoanList = await conn.select(`
            SELECT tk.id_taikhoan, tk.user_name, nv.gioi_tinh, nv.sodienthoai, nv.email, tk.ngaythamgia, vt.ten_vaitro, tk.trangthai
            FROM taikhoan tk
            join vaitro vt on vt.id_vaitro = tk.vaitro_id and vt.ten_vaitro != "user" 
            left outer join nhanvien nv on nv.id_taikhoan = tk.id_taikhoan
        `)

        for (const tk of taiKhoanList) {
            tk.ngaythamgia = formateDate(tk.ngaythamgia)
        }

        res.json(taiKhoanList);
    } catch (error) {
        res.send(error);
    }
}