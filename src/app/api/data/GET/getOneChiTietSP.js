module.exports = async (req, res) => {
    try {
        const { id_phienban } = req.query

        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();
        const getOneCtSp = await conn.select(`
            select *
            from phienbansanpham pbsp
            join sanpham sp on pbsp.id_sanpham = sp.id_sanpham 
            join baohanh bh on pbsp.id_BaoHanh = bh.id_baohanh 
            where pbsp.id_phienban = ?
        `, [id_phienban]);
        res.json(getOneCtSp);
        conn.closeConnect()
    } catch (error) {
        res.send(error);
    }
}