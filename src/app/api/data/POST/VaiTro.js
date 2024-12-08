module.exports = async (req, res) => {
    console.log(req.body)
    const { id_vaitro, ten_vaitro, type } = req.body;
    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();

        if (!ten_vaitro) {
            return res.json({ message: "Vui lòng nhập tên vai trò", success: false })
        }

        if (type === "insert") {
            const checkExist = await conn.select(`
                select *
                from vaitro vt
                where vt.ten_vaitro = ?
            `, [ten_vaitro])

            if (checkExist.length > 0) {
                return res.json({ message: "Vai trò đã tồn tại", success: false })
            }

            const addVaiTro = await conn.insert(`
                INSERT INTO cnpm.vaitro
                (ten_vaitro)
                VALUES(?);
            `, [ten_vaitro])

            if (addVaiTro.status !== 200) {
                return res.json({ message: "Thêm vai trò thất bại", success: false })
            }

            return res.json({ message: "Thêm vai trò thành công", success: true })
        }
        if (type === "update") {
            const checkExist = await conn.select(`
                select *
                from vaitro vt
                where vt.ten_vaitro = ?
            `, [ten_vaitro])

            if (checkExist.length > 0) {
                return res.json({ message: "Vai trò đã tồn tại", success: false })
            }

            const updateVaiTro = await conn.update(`
                update cnpm.vaitro
                set ten_vaitro = ?
                where id_vaitro = ?
            `, [ten_vaitro, id_vaitro])

            return res.json({ message: "Cập nhật bảo hành thành công", success: true })
        }
    } catch (error) {
        res.json({ message: error });
    }
}