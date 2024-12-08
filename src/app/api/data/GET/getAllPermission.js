module.exports = async (req, res) => {
    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();

        const query = await conn.select(`
            SELECT *
            FROM quyen q  
        `)
        res.json(query)
    } catch (error) {
        console.log(error);
    }
}