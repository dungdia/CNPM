module.exports = async (req, res) => {
    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();
        const MSList = await conn.select(`SELECT dung_luong FROM 
            (SELECT ROW_NUMBER() OVER(PARTITION BY dung_luong) c, dung_luong FROM phienbansanpham) memory_storage 
             WHERE c = 1`);
            const data = [];
            for(const item of MSList){
                data.push(item.dung_luong)
            }
        res.send(data);
        conn.closeConnect()
    } catch (error) {
        res.send(error);
    }
}