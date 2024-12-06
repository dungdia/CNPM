const decodeJWT = require("../../../../utils/decodeJWT")

module.exports = async (req,res)=>{
    const {id_phienban} = req.body
    if(!id_phienban){
        res.send({success:false,message:"Không có phiên bản cần xoá"})
        return
    }
    const token = req.cookies.access_token
    const {payload} = await decodeJWT(token)

    try {
        const DBConnecter = require("../../../controller/DBconnecter")
        const conn = new DBConnecter()
        const result = await conn.delete(`DELETE ctgiohang FROM ctgiohang
        JOIN ctsanpham ON ctsanpham.imei = ctgiohang.imei
        JOIN giohang ON giohang.id_giohang = ctgiohang.id_giohang
        JOIN khachhang ON khachhang.id_khachhang = giohang.id_khachhang
        JOIN taikhoan ON taikhoan.id_taikhoan = khachhang.id_taikhoan
        WHERE ctsanpham.pbSanPham_id = ? AND taikhoan.user_name = ?`,[id_phienban,payload.username])
        if(result.status != 200){
            res.send({success:false,message:"Xoá sản phẩm khỏi giỏ hàng thất bại vui lòng thử lại sau"})
            conn.closeConnect()
            return
        }
        res.send({success:true,message:"Xoá sản phẩm khỏi giỏ hàng thành công"})
        conn.closeConnect()
    } catch (error) { 
        res.send({success:false,message:error})
    }

}