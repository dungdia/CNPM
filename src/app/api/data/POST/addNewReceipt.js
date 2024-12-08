const decodeJWT = require('../../../../utils/decodeJWT')


module.exports = async (req,res) =>{
    const {id_nhacungcap,ctPhieuNhap} = req.body
    if(!id_nhacungcap||!ctPhieuNhap){
        res.send({success:false,message:"không đủ thông tin"})
        return
    }
    if(ctPhieuNhap.length <=0){
        res.send({success:false,message:"Không có sản phẩm trong phiếu nhập"})
        return
    }
    const token = req.cookies.access_token
    const {payload} = await decodeJWT(token)
    const usernameLogin = payload.username

    try {
        const DBconnecter = require("../../../controller/DBconnecter")
        const conn = new DBconnecter()
        const [{id_nhanvien}] = await conn.select(`SELECT id_nhanvien FROM nhanvien
        JOIN taikhoan ON taikhoan.id_taikhoan = nhanvien.id_taikhoan
        WHERE taikhoan.user_name = ?`,[usernameLogin])
        if(!id_nhanvien){
            res.send({success:false,message:"Không tìm thầy nhân viên"})
            return
        }

        const imeiList = await conn.select(`SELECT imei FROM ctsanpham`)

        function checkImei(imei){
            for(const item of imeiList){
                if(item.imei == imei)
                    return true
            }
            return false
        }



        const phieunhapResult = await conn.insert(`INSERT INTO phieunhap (ngaynhap,id_nhanvien,id_nhacungcap) 
        VALUES (CURDATE(),?,?)`,[id_nhanvien,id_nhacungcap]) 
        
        if(phieunhapResult.status !=200){
            conn.closeConnect()
            res.send({success:false,message:"Không thể thêm phiếu nhập mới vui lòng liên hệ hỗ trợ"})
            return
        }

        const [{id_phieunhap}] = await conn.select(`SELECT LAST_INSERT_ID() as id_phieunhap`)

        const getRandomInt = require("../../../../utils/getRandomInt")

        for(const sanpham of ctPhieuNhap){
            // console.log(sanpham)
            const chitietphieunhap = await conn.insert(`INSERT INTO ctphieunhap (id_phieunhap,id_phienbansp,so_luong,gia)
            VALUES (?,?,?,?)`,[id_phieunhap,sanpham.id_phienban,sanpham.so_luong,sanpham.gia])

            if(chitietphieunhap.status != 200){
                conn.closeConnect()
                res.send({success:false,message:"Đã xảy lỗi lúc thêm sản phẩm vui lòng liên hệ để hỗ trợ (thêm chi tiết phiếu nhập không thành công)"})
                return
            }
            for(let i=1;i<=sanpham.so_luong;i++){
                const getRandom = getRandomInt(1,999999999999999)
                let imei = '0'.repeat( Math.max(15 - getRandom.toString().length, 0)) + getRandom
                while(checkImei(imei)){
                    const randomNumber = getRandomInt(1,999999999999999)
                    imei = '0'.repeat( Math.max(15 - randomNumber.toString().length, 0)) + randomNumber
                }
                const chiTietSanPhamResult = await conn.insert(`INSERT INTO ctsanpham (imei,pbSanPham_id,phieuNhap_id)
                 VALUES (?,?,?)`,[imei,sanpham.id_phienban,id_phieunhap])
                
                if(chiTietSanPhamResult.status != 200){
                    conn.closeConnect()
                    res.send({success:false,message:"Đã xảy lỗi lúc thêm sản phẩm vui lòng liên hệ để hỗ trợ (thêm chi tiết sản phẩm không thành công)"})
                    return
                }
            }
        }
        conn.closeConnect()
        res.send({success:true,message:"Thêm thành công"})
    } catch (error) {
        console.log(error)
    }
}