module.exports = async (req, res) => {
    console.log(req.query)
    const {id_sanpham} = req.query
    const agrs = []
    if(id_sanpham)
        agrs.push(id_sanpham)
    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();
        const query = await conn.select(`
            select *
            from phienbansanpham pbsp
            join sanpham sp on pbsp.id_sanpham = sp.id_sanpham 
            join baohanh bh on pbsp.id_BaoHanh = bh.id_baohanh
            ${id_sanpham ? `WHERE sp.id_sanpham = ?`:""}`
        ,agrs);
        const data = []
        for (const item of query) {
            data.push({
                id_phienban: item.id_phienban,
                id_sanpham: item.id_sanpham,
                ten_sanpham: item.ten_sanpham,
                ram: item.ram,
                dung_luong: item.dung_luong,
                trangthai: item.trangthai
            })
        }
        if(args){
          res.json(query);
        } else {
          res.json(data);
        }
        conn.closeConnect()
    } catch (error) {
        res.send(error);
    }
}