const bcrypt = require('bcryptjs');
const { DateTime } = require('luxon');
const Validator = require('../../../../utils/validator');
module.exports = async (req, res) => {
    console.log(req.body)
    const { id_taikhoan, username, password, confirmPassword, type } = req.body;
    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();

        switch (true) {
            case !Validator.regexText(username):
                return res.json({ message: "Tên username không được để trống và quá 255 ký tự", success: false }); break;
            case !Validator.regexPassword(password):
                return res.json({ message: "Mật khẩu phải tối thiểu 8 ký tự và không có khoảng trắng", success: false }); break;
            case password !== confirmPassword:
                return res.json({ message: "Mật khẩu không khớp", success: false }); break;
        }

        if (type === "add") {
            const checkExistUsername = await conn.select(`
                SELECT *
                FROM taikhoan tk
                where tk.user_name = ?    
            `, [username])

            if (checkExistUsername.length > 0) {
                return res.json({ message: "Tài khoản đã tồn tại", success: false })
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const addTaiKhoan = await conn.insert(`
                INSERT INTO cnpm.taikhoan(user_name, password, ngaythamgia) 
                VALUES(?, ?, CURDATE());    
            `, [username, hashedPassword])

            if (addTaiKhoan.status != 200) {
                return res.json({ message: "Thêm tài khoản thất bại", success: false })
            }

            return res.json({ message: "Thêm tài khoản thành công", success: true })
        }
        if (type === "edit") {
            console.log(req.body);
            const checkExistUsername = await conn.select(`
                SELECT *
                FROM taikhoan tk
                where tk.id_taikhoan != ? and tk.user_name = ?    
            `, [id_taikhoan, username])

            if (checkExistUsername.length > 0) {
                return res.json({ message: "Tài khoản đã tồn tại", success: false })
            }

            const updateTaiKhoan = await conn.update(`
                UPDATE cnpm.taikhoan
                SET user_name = ?
                WHERE id_taikhoan = ?
            `, [username, id_taikhoan])

            if (updateTaiKhoan.status !== 200) {
                return res.json({ message: "Cập nhật tài khoản thất bại", success: false })
            }

            return res.json({ message: "Cập nhật tài khoản thành công", success: true })
        }
    } catch (error) {
        res.json({ message: error });
    }
}