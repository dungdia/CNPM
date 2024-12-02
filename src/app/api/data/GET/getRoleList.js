const { json } = require("express");

module.exports = async (req, res) => {
    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();

        const getRoleList = await conn.select(`
            SELECT *
            FROM vaitro q  
        `)

        res.json(getRoleList)
    } catch (error) {
        console.log(error);
    }
}