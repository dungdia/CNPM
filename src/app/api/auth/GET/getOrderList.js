const decodeJWT = require("../../../../utils/decodeJWT")

module.exports = async (req,res)=>{
    const token = req.cookies.access_token
    const {payload} = await decodeJWT(token)
    try {
        const DBConnecter = require("../../../controller/DBconnecter")
        const conn = new DBConnecter()
        const orderListQuery = await conn.select(`SELECT 
        hoadon.id_hoadon,sanpham.ten_sanpham,cthoadon.gia_ban,
        hoadon.ngayban,
        trangthaihd.ten_trangthai AS tinh_trang,trangthaihd.id_trangthaiHD 
        FROM hoadon
        JOIN cthoadon ON cthoadon.id_hoadon = hoadon.id_hoadon
        JOIN khachhang ON hoadon.id_khachhang = khachhang.id_khachhang
        JOIN taikhoan ON taikhoan.id_taikhoan = khachhang.id_taikhoan
        JOIN ctsanpham ON cthoadon.imei = ctsanpham.imei
        JOIN phienbansanpham ON phienbansanpham.id_phienban = ctsanpham.pbSanPham_id
        JOIN sanpham ON sanpham.id_sanpham = phienbansanpham.id_sanpham
        JOIN trangthaihd ON trangthaihd.id_trangthaiHD = hoadon.id_trangthaiHD
        WHERE taikhoan.user_name = ?`,[payload.username])

        const result = []
        for(let i=0;i<orderListQuery.length;i++){
            const date = new Date(orderListQuery[i].ngayban)
            orderListQuery[i].ngayban = date.toLocaleDateString()
            if(i>0 && orderListQuery[i].id_hoadon == orderListQuery[i-1].id_hoadon){
                const temp = result.pop()
                temp.gia_ban += orderListQuery[i].gia_ban
                result.push(temp)
            }else{
                result.push(orderListQuery[i])
            }
        }
        res.send({success:true,data:result})

    } catch (error) {
        res.send({success:false,message:error})
    }
}

