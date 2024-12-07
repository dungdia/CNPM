module.exports = async (req,res) =>{
    try {
        const DBConnecter = require("../../../controller/DBconnecter")
        const conn = new DBConnecter()
        const result = await conn.select(`
        SELECT phieunhap.id_phieunhap,phieunhap.ngaynhap,
        nhanvien.ho_ten as nhanviennhap,nhacungcap.ten_nhacungcap
        FROM phieunhap
        JOIN nhanvien ON nhanvien.id_nhanvien = phieunhap.id_nhanvien
        JOIN nhacungcap ON nhacungcap.id_nhacungcap = phieunhap.id_nhacungcap ORDER BY phieunhap.id_phieunhap`)

        for(const item of result){
            const ngayNhap = new Date(item.ngaynhap)
            item.ngaynhap = ngayNhap.toLocaleDateString()
        }

        res.json(result)
        conn.closeConnect()
    } catch (error) {
        console.log(error)
    }
}