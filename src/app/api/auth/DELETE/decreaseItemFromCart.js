const decodeJWT = require("../../../../utils/decodeJWT")

module.exports = async (req,res) =>{
    const {id_phienban} = req.body
    if(!id_phienban){
        res.send({success:false,message:"Không có id phiên bản"})
        return
    }
    const token = req.cookies.access_token
    const {payload} = await decodeJWT(token)

    try {
        const DBConnecter = require("../../../controller/DBconnecter")
        const conn = new DBConnecter()
        const result = await conn.delete(`DELETE ctgh FROM
        ctgiohang ctgh JOIN(
               SELECT gh.imei FROM ctgiohang gh
               JOIN ctsanpham ON ctsanpham.imei = gh.imei
               JOIN giohang ON giohang.id_giohang = gh.id_giohang
               JOIN khachhang ON khachhang.id_khachhang = giohang.id_khachhang
               JOIN taikhoan ON taikhoan.id_taikhoan = khachhang.id_taikhoan
               WHERE ctsanpham.pbSanPham_id = ? AND taikhoan.user_name = ? LIMIT 1) 
               c ON ctgh.imei = c.imei`,[id_phienban,payload.username])
        if(result.status !=200){
            res.send({success:false,message:"Giảm số lượng sản phẩm trong giỏ hàng không thành công"})
            conn.closeConnect()
            return
        }
        res.send({success:true,message:"Giảm số lượng sản phẩm trong giỏ hàng thành công"})
        conn.closeConnect()
    } catch (error) {
        res.send({success:false,message:error})
    }
}