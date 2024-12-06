const decodeJWT = require("../../../../utils/decodeJWT")
const convertToDateTime = require("../../../../utils/convertToDateTime")
const Constant = require("../../../../config/Constant")

module.exports = async (req,res)=>{
    const {fullName,phoneNumber,address,note} = req.body

    if(!fullName ||fullName == ""){
        res.send({success:false,message:"Họ và tên không được bỏ trống!"});
        return;
    }
    if(!phoneNumber || phoneNumber == ""){
        res.send({success:false,message:"Số điện thoại không được bỏ trống"});
        return;
    }
    if(!address || address == ""){
        res.send({success:false,message:"Địa chỉ không được để trống"});
        return;
    }
    const token = req.cookies.access_token
    const {payload} = await decodeJWT(token)

    try {
        const DBConnecter = require("../../../controller/DBconnecter")
        const conn = new DBConnecter()
        const [user] = await conn.select(`SELECT khachhang.id_khachhang,taikhoan.id_taikhoan FROM khachhang
        JOIN taikhoan ON taikhoan.id_taikhoan = khachhang.id_taikhoan
        WHERE taikhoan.user_name= ?`,[payload.username])
        if(!user){
            conn.closeConnect()
            res.send({success:false,message:"Không tìm thấy khách hàng"})
            return
        }
        const cartItemList = await conn.select(`SELECT ctgiohang.imei,baohanh.sothang,ctphieunhap.gia
        FROM ctgiohang
        JOIN giohang ON giohang.id_giohang = ctgiohang.id_giohang
        JOIN ctsanpham ON ctsanpham.imei = ctgiohang.imei
        JOIN phienbansanpham ON phienbansanpham.id_phienban = ctsanpham.pbSanPham_id
		JOIN ctphieunhap ON ctphieunhap.id_phieunhap = ctsanpham.phieuNhap_id AND ctphieunhap.id_phienbansp = ctsanpham.pbSanPham_id
        JOIN baohanh ON baohanh.id_baohanh = phienbansanpham.id_BaoHanh
        WHERE giohang.id_khachhang = ?`,[user.id_khachhang])
        if(!cartItemList){
            conn.closeConnect()
            res.send({success:false,message:"Không có sản phẩm trong giỏ hàng"})
            return
        }

        const removeFromCart = await conn.delete(`DELETE ctgiohang
        FROM ctgiohang
        JOIN giohang ON giohang.id_giohang = ctgiohang.id_giohang
        WHERE giohang.id_khachhang = ?`,[user.id_khachhang])
        if(removeFromCart.status !=200){
            conn.closeConnect()
            res.send({success:false,message:"Đã xảy ra lỗi trong lúc thêm hoá đơn liên hệ hỗ trợ (Xoá chi tiết giỏ hàng thất bại)"})
            return
        }

        const order_result = await conn.insert(`INSERT INTO hoadon (id_khachhang,id_trangthaiHD,note,ngayban) 
        VALUES (?,1,?,CURDATE())`,[user.id_khachhang,note])
        if(order_result.status != 200){
            conn.closeConnect()
            res.send({success:false,message:"Thêm hoá đơn thất bại"})
            return
        }




        const [{order_id}]= await conn.select(`SELECT LAST_INSERT_ID() as order_id`)
        for(const item of cartItemList){
            const baohanh = new Date()
            baohanh.setMonth(baohanh.getMonth()+item.sothang)
            const order_result = await conn.insert(`INSERT INTO cthoadon (id_hoadon,imei,ngaykethuc_baohanh,gia_ban) 
            VALUES (?,?,?,?)`,[order_id,item.imei,convertToDateTime(baohanh),item.gia*Constant.profit])
            if(order_result.status != 200){
                conn.closeConnect()
                res.send({success:false,message:"Đã xảy ra lỗi trong lúc thêm hoá đơn liên hệ hỗ trợ (Thêm chi tiết hoá đơn không thành công)"})
                return
            }
        }

        res.send({success:true,message:"Thêm đơn hàng thành công"})
        conn.closeConnect()
    } catch (error) {
        console.log(error)
        res.send({success:false,message:error})
    }
}