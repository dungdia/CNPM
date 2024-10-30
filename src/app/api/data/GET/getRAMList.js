module.exports = async (req, res) => {
    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();
        const ramList = await conn.select(`SELECT ram FROM 
            (select ROW_NUMBER() OVER(PARTITION BY ram) c, ram FROM phienbansanpham) RAMList
            WHERE c = 1`);
        const data = [];
        for(const item of ramList){
            data.push(item.ram);
        }
        res.send(data);
        conn.closeConnect()
    } catch (error) {
        res.send(error);
    }
}