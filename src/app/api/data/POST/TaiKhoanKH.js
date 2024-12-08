const bcrypt = require("bcryptjs");
const { DateTime } = require('luxon');
module.exports = async (req, res) => {
    try {
        const { id_khachhang, id_taikhoan, trangthai } = req.body
        const DBConnecter = require("../../../controller/DBconnecter.js");
        const conn = new DBConnecter();

        if (req.body.query === "delete") {
            const updateStatusTK = await conn.update(`
                UPDATE cnpm.taikhoan
                SET trangthai = ?
                WHERE id_taikhoan = ?;
            `, [trangthai, id_taikhoan])

            const updateStatusKH = await conn.update(`
                UPDATE cnpm.khachhang
                SET trangthai = ?
                WHERE id_khachhang = ?
            `, [trangthai, id_khachhang])

            if (updateStatusKH.status !== 200 || updateStatusTK.status !== 200) {
                return res.json({ message: "Cập nhật trạng thái khách hàng thất bại", success: false })
            }

            return res.json({ message: "Cập nhật trạng thái khách hàng thành công", success: true })
        }
    } catch (err) {
        res.json({ message: `Error $${err}`, success: false })
    }
}