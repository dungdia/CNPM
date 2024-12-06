module.exports = async (req, res) => {
    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();
        const getAllSp = await conn.select(`
            select sp.id_sanpham , sp.ten_sanpham , th.ten_thuonghieu , sp.trangThai 
            from sanpham sp
            join thuonghieu th on th.id_thuonghieu = sp.id_thuongthieu 
        `);
        // for (const item of getAllSp) {
        //     item.hinh_anh = `<img src="/img/${item.ten_sanpham}" alt="Image" height="100px" width="100px">`
        // }
        res.json(getAllSp);
        conn.closeConnect()
    } catch (error) {
        res.send(error);
    }
}