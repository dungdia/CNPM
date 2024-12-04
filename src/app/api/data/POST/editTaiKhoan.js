const { DateTime } = require('luxon');

module.exports = async (req, res) => {
    const nowInVietnam = DateTime.now().setZone('Asia/Ho_Chi_Minh'); // Set to Vietnam timezone
    const formattedDate = nowInVietnam.toFormat('yyyy-MM-dd HH:mm:ss');

    const { id_taikhoan, username, gender, phonenumber, email, roleId } = req.body;
    console.log(req.body)
    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();

        if (!id_taikhoan || !username || !roleId) {
            return res.json({ message: "Không để trống thông tin", success: false })
        }

        const usernameList = await conn.select(`
            SELECT * 
            FROM taikhoan tk
            WHERE tk.id_taikhoan != ? AND tk.user_name = ?
        `, [id_taikhoan, username]);

        console.log(usernameList)

        if (usernameList.length > 0) {
            return res.json({ message: "Tên tài khoản đã tồn tại", success: false })
        }

        await conn.startTransaction();

        const updateTK = await conn.update(`
            update taikhoan tk
            set tk.user_name = ?, tk.vaitro_id = ?
            where tk.id_taikhoan = ?
        `, [username, roleId, id_taikhoan])

        if (updateTK.status !== 200) {
            return res.json({ message: "Lỗi không thể cập nhật tài khoản", success: false })
        }

        const updateNV = await conn.update(`
            update nhanvien nv
            set nv.gioi_tinh = ?, nv.sodienthoai = ?, nv.email = ?
            where nv.id_taikhoan = ?
        `, [gender, phonenumber, email, id_taikhoan])

        if (updateNV.status !== 200) {
            return res.json({ message: "Lỗi không thể cập nhật nhân viên", success: false })
        }

        await conn.commit();

        res.json({ message: "Thêm tài khoản thành công", success: true })
    } catch (error) {
        console.error("Error fetching data:", error);
        res.json({ message: "Lỗi không thể thực hiện việc đăng ký", success: false })
    }
}