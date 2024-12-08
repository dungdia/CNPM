module.exports = async (req, res) => {
    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();
        const getAllCTSP = await conn.select(`
            select pbsp.id_phienban, pbsp.id_sanpham, sp.ten_sanpham, pbsp.ram, pbsp.dung_luong, bh.sothang, pbsp.trangthai 
            from phienbansanpham pbsp
            join sanpham sp on pbsp.id_sanpham = sp.id_sanpham 
            join baohanh bh on pbsp.id_BaoHanh = bh.id_baohanh 
        `);
        res.json(getAllCTSP);
        conn.closeConnect()
    } catch (error) {
        res.send(error);
    }
}