module.exports = async (req, res) => {
    console.log(req.body)
    const { id_phienban, id_sanpham, ram, dung_luong, id_baoHanh, query, trangthai } = req.body
    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();

        function checkEmpty() {
            if (!id_sanpham || !ram || !dung_luong || !id_baoHanh) {
                return res.json({ message: "Không được để trống" });
            }
        }

        if (query === "insert") {
            checkEmpty()

            console.log("Insert")

            const insertSanPham = await conn.insert(`
                INSERT INTO cnpm.phienbansanpham
                (id_sanpham, ram, dung_luong, id_BaoHanh)
                VALUES(?, ?, ?, ?);
            `, [id_sanpham, ram, dung_luong, id_baoHanh]);

            if (insertSanPham.status !== 200) {
                return res.json({ message: "Thêm phiên bản sản phẩm không thành công", success: false })
            }

            res.json({ message: "Thêm phiên bản sản phẩm thành công", success: true });
        }
        if (query === "update") {
            checkEmpty()

            console.log("Update")

            const updateSanPham = await conn.update(`
                UPDATE cnpm.phienbansanpham
                SET id_sanpham=?, ram=?, dung_luong=?, id_BaoHanh=?
                WHERE id_phienban=?;    
            `, [id_sanpham, ram, dung_luong, id_baoHanh, id_phienban]);

            if (updateSanPham.status !== 200) {
                return res.json({ message: "Sửa phiên bản sản phẩm không thành công", success: false })
            }

            res.json({ message: "Sửa sản phiên bản sản phẩm thành công", success: true });
        }
        if (query === "delete") {
            console.log("Delete")

            const updateTrangThai = await conn.update(`
                UPDATE cnpm.phienbansanpham
                SET trangthai = ?
                WHERE id_phienban=?;    
            `, [trangthai, id_phienban]);

            if (updateTrangThai.status !== 200) {
                return res.json({ message: "Thay đổi trạng thái phiên bản sản phẩm không thành công", success: false })
            }

            return res.json({ message: "Thay đổi trạng thái phiên bản sản phẩm thành công", success: true })
        }
    } catch (error) {
        res.json({ message: error });
    }
}