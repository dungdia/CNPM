const bcrypt = require('bcryptjs');
const { DateTime } = require('luxon');
module.exports = async (req, res) => {
    const { id_taikhoan, username, password, confirmPassword, type } = req.body;
    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();

        if (type === "add") {
            if (!username || !password || !confirmPassword) {
                return res.json({ message: "Vui lòng nhập đầy đủ thông tin", success: false })
            }

            if (password.length < 8) {
                return res.json({ message: "Mật khẩu phải có ít nhất 8 ký tự", success: false })
            }

            if (password !== confirmPassword) {
                return res.json({ message: "Mật khẩu không khớp", success: false })
            }

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