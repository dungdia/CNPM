const { compareSync } = require('bcryptjs');
const { DateTime } = require('luxon');

module.exports = async (req, res) => {
    const nowInVietnam = DateTime.now().setZone('Asia/Ho_Chi_Minh'); // Set to Vietnam timezone
    const formattedDate = nowInVietnam.toFormat('yyyy-MM-dd HH:mm:ss');

    const { username, gender, phoneNumber, email, password, confirmPassword, roleId } = req.body;
    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();

        if (!username || !password || !confirmPassword || !roleId) {
            return res.json({ message: "Không để trống thông tin", success: false })
        }

        const usernameList = await conn.select(`
            SELECT user_name as username
            FROM taikhoan
            WHERE user_name = ?
        `, [username]);

        if (usernameList.length > 0) {
            return res.json({ message: "Tên tài khoản đã tồn tại", success: false })
        }

        if (password != confirmPassword) {
            return res.json({ message: "Mật khẩu xác nhận không khớp", success: false })
        }

        // TODO: using commit and rollback
        await conn.startTransaction();

        const addTaiKhoan = await conn.insert(`
            INSERT INTO cnpm.taikhoan (user_name, password, vaitro_id, ngaythamgia)
            VALUES (?, ?, ?, ?);
        `, [username, password, roleId, formattedDate]);

        if (addTaiKhoan.status !== 200) {
            return res.json({ message: "Lỗi không thể thêm tài khoản", success: false })
        }

        const lastTaiKhoanId = addTaiKhoan.insertId

        const addKhachHang = await conn.insert(`
            INSERT INTO cnpm.nhanvien (id_taikhoan, gioi_tinh, sodienthoai, email)
            VALUES (?, ?, ?, ?);
        `, [lastTaiKhoanId, gender, phoneNumber, email]);

        if (addKhachHang.status !== 200) {
            return res.json({ message: "Lỗi không thể thêm khách hàng", success: false })
        }

        await conn.commit();

        res.json({ message: "Thêm tài khoản thành công", success: true })
    } catch (error) {
        console.error("Error fetching data:", error);
        res.json({ message: "Lỗi không thể thực hiện việc đăng ký", success: false })
    }
}