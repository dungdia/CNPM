module.exports = async (req, res) => {
    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter()
        const productByIdList = await conn.select(`
            SELECT sp.ten_sanpham, ctpn.gia ,pbsp.dung_luong, pbsp.ram, sp.kichThuocMan, sp.heDieuHanh, sp.cameraSau, sp.cameraTruoc, sp.chipXuLy, sp.dungLuongPin, th.ten_thuonghieu 
            FROM sanpham sp 
            JOIN phienbansanpham pbsp ON sp.id_sanpham = pbsp.id_sanpham 
            JOIN ctphieunhap ctpn ON ctpn.id_phienbansp = pbsp.id_phienban 
            JOIN thuonghieu th ON th.id_thuonghieu = sp.id_thuongthieu
            WHERE sp.id_sanpham = ?
            ORDER BY pbsp.ram ASC 
        `, [req.query.id])
        const data = [];
        for (const item of productByIdList) {
            data.push(item)
        }
        res.send(data)
        conn.closeConnect()
    } catch (error) {
        res.send(error)
    }
}