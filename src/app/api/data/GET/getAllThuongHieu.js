module.exports = async (req, res) => {
    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();
        const getAllThuongHieu = await conn.select(`
            select *
            from thuonghieu th
        `);
        res.json(getAllThuongHieu);
        conn.closeConnect()
    } catch (error) {
        res.send(error);
    }
}