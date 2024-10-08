module.exports = async (req, res) => {
    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();
        const brandList = await conn.select("SELECT ten_thuonghieu AS brandName FROM thuonghieu");
        res.send(brandList);
    } catch (error) {
        res.send(error);
    }
}