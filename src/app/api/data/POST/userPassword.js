const decodeJWT = require('../../../../utils/decodeJWT')
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
    const { userOldPassword, userNewPassword, userConfirmNewPassword, access_token } = req.body
    console.log(userOldPassword, access_token)

    const decodedAccessToken = await decodeJWT(access_token)
    const usernameLogin = decodedAccessToken.payload.username

    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();
        const selectKH = await conn.select(`
            SELECT *
            FROM khachhang kh
            JOIN taikhoan tk ON tk.id_taikhoan = kh.id_taikhoan
            where tk.user_name = ?
        `, [usernameLogin]);

        const userPassword = selectKH[0].password

        const match = await bcrypt.compare(userOldPassword, userPassword)
        if (match) {
            const saltRounds = 10;
            const newHashedPassword = await bcrypt.hash(userNewPassword, saltRounds);
            const updateUserPassword = await conn.update(`
                UPDATE taikhoan tk
                JOIN khachhang kh ON tk.id_taikhoan = kh.id_taikhoan
                SET tk.password = ?
                WHERE tk.user_name = ?;    
            `, [newHashedPassword, usernameLogin]);

            if (updateUserPassword.status === 200) {
                res.send({ message: "Lưu thông mật khẩu thành công", success: true })
                return
            }
            res.send({ message: "Đã xảy ra lỗi trong lúc lưu mật khẩu", success: false })
        } else {
            res.send({ message: "Mật khẩu cũ không không khớp", success: false })
        }
    } catch (error) {
        console.log(error)
    }
}
