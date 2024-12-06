module.exports = async (req, res) => {
    try {
        const { id_sanpham } = req.query

        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();
        const getOneSp = await conn.select(`
            select *
            from sanpham sp
            join thuonghieu th on th.id_thuonghieu = sp.id_thuonghieu 
            where sp.id_sanpham = ?
        `, [id_sanpham]);
        res.json(getOneSp);
        conn.closeConnect()
    } catch (error) {
        res.send(error);
    }
}