module.exports = async (req, res) => {
    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();
        const brandList = await conn.select("SELECT ten_thuonghieu AS brandName FROM thuonghieu");
        const data = [];
        for (const item of brandList){
            data.push(item.brandName);
        }
        res.send(data);

    } catch (error) {
        res.send(error);
    }
}