const formatDate = require('../../../../utils/formatDate');
module.exports = async (req, res) => {
    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();

        const getAllHoaDon = await conn.select(`
            select *
            from hoadon hd 
            join khachhang kh on kh.id_khachhang = hd.id_khachhang
            join trangthaihd tthd on tthd.id_trangthaiHD = hd.id_trangthaiHD
        `)
        const data = []
        for (const item of getAllHoaDon) {
            data.push({
                "ID Hóa Đơn": item.id_hoadon,
                "ID Khách Hàng": item.id_khachhang,
                "Tên Khách": item.ho_ten,
                "Ngày bán": formatDate(item.ngayban),
                "Trạng thái hóa đơn": item.ten_trangthai,
            })
        }
        return res.json(data)
    }
    catch (error) {

    }
};
