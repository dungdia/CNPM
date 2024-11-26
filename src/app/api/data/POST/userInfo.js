const decodeJWT = require('../../../../utils/decodeJWT')

module.exports = async (req, res) => {
    console.log(req.body)

    const { userFullname, userGender, userPhoneNumber, userEmail, userAddress, access_token } = req.body

    const decodedAccessToken = await decodeJWT(access_token)
    const usernameLogin = decodedAccessToken.payload.username
    console.log(usernameLogin)

    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();

        const updateUser = await conn.update(`
            UPDATE khachhang kh
            JOIN taikhoan tk ON tk.id_taikhoan = kh.id_taikhoan
            SET kh.ho_ten = ?, kh.gioi_tinh = ?, kh.sodienthoai = ?, kh.email = ? , kh.diachi = ?
            WHERE tk.user_name = ?;    
        `, [userFullname, userGender, userPhoneNumber, userEmail, userAddress, usernameLogin]);
        if (updateUser.status === 200) {
            res.send({ message: "Lưu thông tin tài khoản thành công", success: true })
            return
        }
        res.send({ message: "Đã xảy ra lỗi trong lúc lưu thông tin", success: false })
    } catch (error) {
        console.log(error)
    }
}