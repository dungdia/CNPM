const decodeJWT = require("../../../../utils/decodeJWT")

module.exports = async (req,res) =>{
    const {id_phienban} = req.body
    if(!id_phienban){
        res.send({success:false, message:"Không có phiên bản cần thêm vô giỏ hàng"})
        return
    }
    const token = req.cookies.access_token
    const {payload} = await decodeJWT(token)
    try {
        const DBConnecter = require("../../../controller/DBconnecter")
        const conn = new DBConnecter()
        const soLuongQuery = await conn.select(`SELECT COUNT(imei) as so_luong FROM 
            (SELECT ROW_NUMBER() OVER(PARTITION BY ctsanpham.imei) stt,ctsanpham.*
            FROM ctsanpham 
                LEFT JOIN ctgiohang ON ctgiohang.imei = ctsanpham.imei
                LEFT JOIN cthoadon ON cthoadon.imei = ctsanpham.imei
                LEFT JOIN hoadon ON hoadon.id_hoadon = cthoadon.id_hoadon
            WHERE ctsanpham.pbSanPham_id = ? AND ((hoadon.id_trangthaiHD = 5 AND ctgiohang.imei IS NULL) OR 
            (cthoadon.imei IS NULL AND ctgiohang.imei IS NULL))) c WHERE stt = 1;`,[id_phienban])
            const so_luong = (soLuongQuery.length > 0 ? soLuongQuery[0].so_luong : 0)
        if(so_luong <= 0){
            res.send({success:false, message: "Đã hết hàng vui lòng quay lại sau"})
            return
        }
        const [{id_giohang}] = await conn.select(`SELECT id_giohang
        FROM khachhang,taikhoan,giohang WHERE 
        khachhang.id_taikhoan = taikhoan.id_taikhoan 
        AND khachhang.id_khachhang = giohang.id_khachhang 
        AND taikhoan.user_name = ?`,[payload.username])
        if(!id_giohang){
            res.send({success:false, message:"Không tìm thấy giỏ hàng vui lòng báo lại lỗi"})
            return
        }
        const [{imei}] = await conn.select(`SELECT imei FROM 
        (SELECT ROW_NUMBER() OVER(PARTITION BY ctsanpham.imei) stt,ctsanpham.*
        FROM ctsanpham 
            LEFT JOIN ctgiohang ON ctgiohang.imei = ctsanpham.imei
            LEFT JOIN cthoadon ON cthoadon.imei = ctsanpham.imei
            LEFT JOIN hoadon ON hoadon.id_hoadon = cthoadon.id_hoadon
        WHERE ctsanpham.pbSanPham_id = ? AND ((hoadon.id_trangthaiHD = 5 AND ctgiohang.imei IS NULL) OR 
        (cthoadon.imei IS NULL AND ctgiohang.imei IS NULL))) c WHERE stt = 1 LIMIT 1;`,[id_phienban])

        if(!imei){
            res.send({success:false,message: "Không tìm thấy sản phẩm tồn kho vui lòng thử lại sau"})
            return
        }

        const result = await conn.insert(`INSERT INTO ctgiohang (id_giohang,imei) VALUES (?,?)`,[id_giohang,imei])
        if(result.status != 200){
            res.send({success:false, message: "Thêm thất bại vui lòng thử lại sau"})
            return
        }
        res.send({success:true,message:"Thêm giỏ hàng thành công"})

    } catch (error) {
        res.send({success:false,message:error})
    }

}