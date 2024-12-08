module.exports = async (req, res) => {
    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();

        const query = await conn.select(`
            SELECT *
            FROM vaitro vt
            WHERE vt.id_vaitro != 1
        `)
        res.json(query)
    } catch (error) {
        console.log(error);
    }
}