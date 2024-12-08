module.exports = async (req, res) => {
    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();
        const getAllBh = await conn.select(`
            select *
            from baohanh bh
        `);
        res.json(getAllBh);
        conn.closeConnect()
    } catch (error) {
        res.send(error);
    }
}