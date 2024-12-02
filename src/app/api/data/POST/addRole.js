module.exports = async (req, res) => {
    const response = { message: "", result: false };
    const { ten_vaitro } = req.body

    if (!ten_vaitro) {
        return res.send({ message: "Vui lòng nhập tên vai trò", success: false });
    }

    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();

        const checkRole = await conn.select(`
            SELECT * FROM vaitro 
            WHERE ten_vaitro = ?
        `, [ten_vaitro]);

        if (checkRole.length > 0) {
            response.message = "Vai trò đã tồn tại";
            return res.send(response);
        }

        const insertRole = await conn.insert(`
            INSERT INTO vaitro (ten_vaitro) VALUES (?)    
        `, [ten_vaitro]);

        if (insertRole.status === 200) {
            const newRole = await conn.select(`
                SELECT * 
                FROM vaitro v
                WHERE v.ten_vaitro = ?   
            `, [ten_vaitro]);

            if (newRole.length > 0) {
                response.message = newRole[0].id_vaitro;
                response.success = true;
                return res.send(response);
            } else {
                response.message = "Không tìm thấy role";
            }
        } else {
            response.message = "Lỗi không thêm role được";
        }

        conn.closeConnect();
    } catch (error) {
        console.log(error);
    }
}