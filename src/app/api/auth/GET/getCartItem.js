const decodeJWT = require("../../../../utils/decodeJWT")

module.exports = async (req,res)=>{
    const token = req.cookies.access_token
    const {payload} = await decodeJWT(token)

    try {
        const DBConnecter = require("../../../controller/DBconnecter")
        const conn = new DBConnecter()
        const result = await conn.select(`SELECT ctgiohang.*,sanpham.ten_sanpham,phienbansanpham.*,
        ctphieunhap.gia,COUNT(ctsanpham.imei) as so_luong FROM ctgiohang
        JOIN giohang ON giohang.id_giohang = ctgiohang.id_giohang
        JOIN khachhang ON khachhang.id_khachhang = giohang.id_khachhang
        JOIN taikhoan ON taikhoan.id_taikhoan = khachhang.id_taikhoan
        JOIN ctsanpham ON ctsanpham.imei = ctgiohang.imei
        JOIN phienbansanpham ON phienbansanpham.id_phienban = ctsanpham.pbSanPham_id
        JOIN sanpham ON sanpham.id_sanpham = phienbansanpham.id_sanpham
        LEFT JOIN ctphieunhap ON ctsanpham.phieuNhap_id = ctphieunhap.id_phieunhap AND ctsanpham.pbSanPham_id = ctphieunhap.id_phienbansp
        WHERE taikhoan.user_name = ? GROUP BY ctsanpham.pbSanPham_id`,[payload.username])
        
        const Constant = require("../../../../config/Constant")
        const data = []
        for(const item of result){
            item.gia*=Constant.profit
            data.push(item)
        }

        res.send({success:true,data})
        
    } catch (error) {
        res.send({success:false,message:error})
    }
}