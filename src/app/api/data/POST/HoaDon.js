module.exports = async (req, res) => {
    const { id_hoadon, id_trangthaiHD } = req.body;
    console.log(req.body)
    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();

        const updateHoaDon = await conn.update(`
            UPDATE cnpm.hoadon
            SET id_trangthaiHD = ?
            WHERE id_hoadon = ?
        `, [id_trangthaiHD, id_hoadon])

        if (updateHoaDon.status !== 200) {
            return res.json({ message: "Cập nhật trạng thái hóa đơn thất bại", success: true });
        }

        conn.closeConnect()
        return res.json({ message: "Cập nhật trạng thái hóa đơn thành công", success: true });
    } catch (error) {
        res.json({ message: error });
    }
}