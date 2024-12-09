const Validator = require("../../../../utils/validator");

module.exports = async (req, res) => {
    const { id_phienban, id_sanpham, ram, dung_luong, id_baoHanh, type, trangthai } = req.body
    console.log(req.body)

    switch (true) {
        case !Validator.isNumber(ram):
            return res.json({ message: "Ram không được trống, phải là số và lớn hơn 0", success: false });
        case !Validator.isNumber(dung_luong):
            return res.json({ message: "Dung lượng không được trống, phải là số và lớn hơn 0", success: false });
    }

    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();

        if (type === "insert") {
            console.log("Insert")

            const insertSanPham = await conn.insert(`
                INSERT INTO cnpm.phienbansanpham
                (id_sanpham, ram, dung_luong, id_BaoHanh)
                VALUES(?, ?, ?, ?);
            `, [id_sanpham, ram, dung_luong, id_baoHanh]);

            if (insertSanPham.status !== 200) {
                return res.json({ message: "Thêm phiên bản sản phẩm không thành công", success: false })
            }

            return res.json({ message: "Thêm phiên bản sản phẩm thành công", success: true });
        }
        if (type === "update") {
            console.log("Update")

            const updateSanPham = await conn.update(`
                UPDATE cnpm.phienbansanpham
                SET ram = ?, 
                    dung_luong = ?, 
                    id_BaoHanh = ?
                WHERE id_phienban = ?
            `, [ram, dung_luong, id_baoHanh, id_phienban]);

            if (updateSanPham.status !== 200) {
                return res.json({ message: "Sửa phiên bản sản phẩm không thành công", success: false })
            }

            return res.json({ message: "Sửa sản phiên bản sản phẩm thành công", success: true });
        }
        if (type === "delete") {
            console.log("Delete")

            const updateTrangThai = await conn.update(`
                UPDATE cnpm.phienbansanpham
                SET trangthai = ?
                WHERE id_phienban=?
            `, [trangthai, id_phienban]);

            if (updateTrangThai.status !== 200) {
                return res.json({ message: "Thay đổi trạng thái phiên bản sản phẩm không thành công", success: false })
            }

            return res.json({ message: "Thay đổi trạng thái phiên bản sản phẩm thành công", success: true })
        }
    } catch (error) {
        res.json({ message: `Error: ${error}`, success: false });
    }
}