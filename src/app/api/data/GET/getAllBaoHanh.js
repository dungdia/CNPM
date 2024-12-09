module.exports = async (req, res) => {
    console.log(req.query)
    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();
        let query
        query = await conn.select(`
            select *
            from baohanh bh
        `);
        const data = []
        for (const item of query) {
            data.push(item)
        }
        conn.closeConnect()
        return res.json(data);
    } catch (error) {
        res.send(error);
    }
}