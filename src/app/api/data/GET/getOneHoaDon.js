const formatDate = require('../../../../utils/formatDate');
module.exports = async (req, res) => {
    const { id_hoadon } = req.query
    console.log(req.query)

    try {
        const DBConnecter = require("../../../controller/DBconnecter.js");
        const conn = new DBConnecter();

        const getOneHoaDon = await conn.select(`
            select *
            from hoadon hd
            join khachhang kh on hd.id_khachhang = kh.id_khachhang 
            join cthoadon cthd on hd.id_hoadon = cthd.id_hoadon 
            join ctsanpham ctsp on cthd.imei = ctsp.imei 
            join phienbansanpham pbsp on ctsp.pbSanPham_id = pbsp.id_phienban 
            join sanpham sp on pbsp.id_sanpham = sp.id_sanpham
            where hd.id_hoadon = ?
        `, [id_hoadon])
        const data = []
        data.push({
            "id_hoa_don": getOneHoaDon[0].id_hoadon,
            "ho_ten": getOneHoaDon[0].ho_ten,
            "dia_chi": getOneHoaDon[0].diachi,
            "so_dien_thoai": getOneHoaDon[0].sodienthoai,
            "trang_thai_hoadon": getOneHoaDon[0].id_trangthaiHD,
            "ghi_chu": getOneHoaDon[0].note,
            "chi_tiet_sp": getOneHoaDon.map(item => ({
                "imei": item.imei,
                "ten_san_pham": item.ten_sanpham,
                "gia_ban": parseFloat(item.gia_ban),
                "ngay_ban": formatDate(item.ngayban)
            }))
        })
        return res.json(data)
    } catch (error) {
        return res.send(error);
    }
}