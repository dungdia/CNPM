module.exports =async (req,res)=>{
    const {id_phieunhap} = req.query
    if(!id_phieunhap){
        res.json([])
        return
    }
    try {
        const DBConnecter = require("../../../controller/DBconnecter")
        const conn = new DBConnecter()
        const result = await conn.select(`SELECT ctphieunhap.id_phieunhap
        ,phienbansanpham.id_phienban,sanpham.ten_sanpham,phienbansanpham.ram,
        phienbansanpham.dung_luong
        ,ctphieunhap.so_luong,ctphieunhap.gia
        FROM ctphieunhap 
        JOIN phienbansanpham ON phienbansanpham.id_phienban = ctphieunhap.id_phienbansp
        JOIN sanpham ON sanpham.id_sanpham = phienbansanpham.id_sanpham
        WHERE ctphieunhap.id_phieunhap = ?`,[id_phieunhap])
        const VND = new Intl.NumberFormat("Vi-VN", {
            style: "currency",
            currency: "VND",
          });
        for(const item of result){
            item.gia = VND.format(item.gia)
        }
        res.json(result)
        conn.closeConnect()
    } catch (error) {
        console.log(error)
    }

}