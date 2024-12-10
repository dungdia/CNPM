const formatDate = require('../../../../utils/formatDate');
module.exports = async (req, res) => {
    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();

        const getAllHoaDon = await conn.select(`
            select *
            from trangthaihd tthd
        `)
        const data = []
        for (const item of getAllHoaDon) {
            data.push(item)
        }
        return res.json(data)
    }
    catch (error) {
        return res.send(error)
    }
};
