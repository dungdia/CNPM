module.exports = async (req, res) => {
    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter()
        const productByIdList = await conn.select(`
        SELECT * FROM(SELECT ROW_NUMBER() OVER(PARTITION BY pbsp.id_phienban) stt, 
        pbsp.id_phienban, sp.ten_sanpham, ctpn.gia ,pbsp.dung_luong, pbsp.ram, sp.kichThuocMan, 
        sp.heDieuHanh, sp.cameraSau, sp.cameraTruoc, sp.chipXuLy, sp.dungLuongPin, th.ten_thuonghieu 
        FROM sanpham sp 
        JOIN phienbansanpham pbsp ON sp.id_sanpham = pbsp.id_sanpham 
        JOIN ctphieunhap ctpn ON ctpn.id_phienbansp = pbsp.id_phienban 
        JOIN thuonghieu th ON th.id_thuonghieu = sp.id_thuonghieu
        WHERE sp.id_sanpham = ?
        ORDER BY pbsp.ram ASC) c WHERE stt = 1 
        `, [req.query.id])
        const data = [];
        const Constant = require('../../../../config/Constant')
        for (const item of productByIdList) {
            item.gia = Math.ceil(item.gia*Constant.profit)
            const soLuongQuery = await conn.select(`SELECT COUNT(imei) as so_luong FROM 
            (SELECT ROW_NUMBER() OVER(PARTITION BY ctsanpham.imei) stt,ctsanpham.*
            FROM ctsanpham 
                LEFT JOIN ctgiohang ON ctgiohang.imei = ctsanpham.imei
                LEFT JOIN cthoadon ON cthoadon.imei = ctsanpham.imei
                LEFT JOIN hoadon ON hoadon.id_hoadon = cthoadon.id_hoadon
            WHERE ctsanpham.pbSanPham_id = ? AND ((hoadon.id_trangthaiHD = 5 AND ctgiohang.imei IS NULL) OR 
            (cthoadon.imei IS NULL AND ctgiohang.imei IS NULL))) c WHERE stt = 1;`,[item.id_phienban])
            item.so_luong = (soLuongQuery.length > 0 ? soLuongQuery[0].so_luong : 0)
            data.push(item)
        }
        res.send(data)
        conn.closeConnect()
    } catch (error) {
        res.send(error)
    }
}