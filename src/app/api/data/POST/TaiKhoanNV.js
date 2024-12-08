const bcrypt = require("bcryptjs");
const { DateTime } = require('luxon');
module.exports = async (req, res) => {
    console.log(req.body)

    const nowInVietnam = DateTime.now().setZone('Asia/Ho_Chi_Minh');
    const formattedDate = nowInVietnam.toFormat('yyyy-MM-dd HH:mm:ss');

    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();
        // INSERT TAIKHOAN
        if (req.body.query === "insert") {
            console.log("Insert")

            const { username, fullName, gender, phoneNumber, email, password, confirmPassword, roleId } = req.body;

            if (!username || !fullName || !gender || !phoneNumber || !email || !password || !confirmPassword) {
                return res.json({ message: "Vui lòng nhập đầy đủ thông tin", success: false })
            }

            if (password !== confirmPassword) {
                return res.json({ message: "Mật khẩu không khớp", success: false })
            }

            const checkExistUsername = await conn.select(`
                SELECT *
                FROM taikhoan tk
                join vaitro vt on vt.id_vaitro = tk.vaitro_id and vt.id_vaitro != 1 
                join nhanvien nv on nv.id_taikhoan = tk.id_taikhoan
                where tk.user_name = ?
            `, [username])

            if (checkExistUsername.length > 0) {
                return res.json({ message: "Tên tài khoản đã tồn tại", success: false })
            }

            const checkExistEmail = await conn.select(`
                SELECT *
                FROM taikhoan tk
                join vaitro vt on vt.id_vaitro = tk.vaitro_id and vt.id_vaitro != 1 
                join nhanvien nv on nv.id_taikhoan = tk.id_taikhoan
                where nv.email = ?
            `, [email])

            if (checkExistEmail.length > 0) {
                return res.json({ message: "Email đã tồn tại", success: false })
            }

            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const insertTK = await conn.insert(`
                INSERT INTO cnpm.taikhoan
                (user_name, password, vaitro_id, ngaythamgia)
                VALUES(?, ?, ?, ?);    
            `, [username, hashedPassword, roleId, formattedDate])

            if (insertTK.status !== 200) {
                return res.json({ message: "Thêm tài khoản nhân viên thất bại", success: false })
            }

            const lastId = await conn.lastId();

            const insertNV = await conn.insert(`
                INSERT INTO cnpm.nhanvien
                (id_taikhoan, ho_ten, gioi_tinh, sodienthoai, email)
                VALUES(?, ?, ?, ?, ?);
            `, [lastId, fullName, gender, phoneNumber, email])

            if (insertNV.status !== 200) {
                return res.json({ message: "Thêm tài khoản nhân viên thất bại", success: false })
            }

            return res.json({ message: "Thêm tài khoản nhân viên thành công", success: true })
        }
        // UPDATE TAIKHOAN
        if (req.body.query === "update") {
            const { id_nhanvien, id_taikhoan, username, fullName, gender, phoneNumber, email, roleId } = req.body;

            const checkExistUsername = await conn.select(`
                SELECT *
                FROM taikhoan tk
                join vaitro vt on vt.id_vaitro = tk.vaitro_id and vt.id_vaitro != 1 
                join nhanvien nv on nv.id_taikhoan = tk.id_taikhoan and nv.id_nhanvien != ?
                where tk.user_name = ?
            `, [id_nhanvien, username])

            if (checkExistUsername.length > 0) {
                return res.json({ message: "Tên tài khoản đã tồn tại", success: false })
            }

            const checkExistEmail = await conn.select(`
                SELECT *
                FROM taikhoan tk
                join vaitro vt on vt.id_vaitro = tk.vaitro_id and vt.id_vaitro != 1 and tk.id_taikhoan != ?
                join nhanvien nv on nv.id_taikhoan = tk.id_taikhoan and nv.id_nhanvien != ?
                where nv.email = ?
            `, [id_nhanvien, email])

            if (checkExistEmail.length > 0) {
                return res.json({ message: "Email đã tồn tại", success: false })
            }

            const updateTK = await conn.update(`
                update cnpm.taikhoan tk
                set user_name = ?, vaitro_id = ?
                where tk.id_taikhoan = ?                        
            `, [username, roleId, id_taikhoan])

            const updateNV = await conn.update(`
                UPDATE cnpm.nhanvien
                SET ho_ten = ?, gioi_tinh = ?, sodienthoai = ?, email = ?
                WHERE id_nhanvien = ?;
            `, [fullName, gender, phoneNumber, email, id_nhanvien])

            if (updateTK.status !== 200 || updateNV.status !== 200) {
                return res.json({ message: "Cập nhật tài khoản nhân viên thất bại", success: false })
            }

            return res.json({ message: "Cập nhật tài khoản nhân viên thành công", success: true })
        }
        if (req.body.query === "delete") {
            const { id_nhanvien, id_taikhoan, trangthai } = req.body;
            console.log("delete");

            const updateStatusTK = await conn.update(`
                update cnpm.taikhoan tk
                set trangthai = ?
                where tk.id_taikhoan = ?       
            `, [trangthai, id_taikhoan])

            const updateStatusNV = await conn.update(`
                UPDATE cnpm.nhanvien
                SET trangthai = ?
                WHERE id_nhanvien = ?;
            `, [trangthai, id_nhanvien])

            if (updateStatusNV.status !== 200 || updateStatusTK.status !== 200) {
                return res.json({ message: "Cập nhật trạng thái nhân viên thất bại", success: false })
            }

            return res.json({ message: "Cập nhật trạng thái nhân viên thành công", success: true })
        }
    } catch (error) {
        res.json({ message: `${error}`, success: false })
    }
}