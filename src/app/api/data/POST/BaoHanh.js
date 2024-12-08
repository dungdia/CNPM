module.exports = async (req, res) => {
    console.log(req.body)
    const { id_baohanh, sothang } = req.body;
    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();
        if (req.body.query === "insert") {
            const checkExist = await conn.select(`
                select *
                from baohanh bh
                where bh.sothang = ?
            `, [sothang])

            if (checkExist.length > 0) {
                return res.json({ message: "Bảo hành đã tồn tại", success: false })
            }

            const query = await conn.insert(`
                INSERT INTO cnpm.baohanh
                (sothang)
                VALUES(?);    
            `, [sothang])

            if (query.status !== 200) {
                return res.json({ message: "Thêm bảo hành thất bại", success: false })
            }
            return res.json({ message: "Thêm bảo hành thành công", success: true })
        }
        if (req.body.query === "update") {
            const checkExist = await conn.select(`
                select *
                from baohanh bh
                where bh.sothang = ?
            `, [sothang])

            if (checkExist.length > 0) {
                return res.json({ message: "Bảo hành đã tồn tại", success: false })
            }

            const query = await conn.update(`
                UPDATE cnpm.baohanh
                SET sothang = ?
                WHERE id_baohanh = ?;
            `, [sothang, id_baohanh])

            if (query.status !== 200) {
                return res.json({ message: "Cập nhật bảo hành thất bại", success: false })
            }

            return res.json({ message: "Cập nhật bảo hành thành công", success: true })
        }
    } catch (error) {
        res.json({ message: error });
    }
}