module.exports = async (req, res) => {
    const { id_vaitro, id_quyen, havePermission } = req.body;

    if (!id_vaitro || !id_quyen || !havePermission) {
        res.send({ success: false, message: "Thiếu thông tin" });
        return;
    }

    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();

        const findRoleDetail = await conn.select(`
            SELECT * FROM ctquyen WHERE id_vaitro = "${id_vaitro}" AND id_quyen = "${id_quyen}"
        `)

        if (findRoleDetail.length > 0) {
            existed = true;
        }

        if (havePermission === 0 && existed === true) {
            const deleteRoleDetail = await conn.delete(`
                DELETE FROM ctquyen WHERE id_vaitro = "${id_vaitro}" AND id_quyen = "${id_quyen}"
            `)

            if (deleteRoleDetail.status === 200) {
                res.send({ success: true });
            }
        }

        if (havePermission === 1 && existed === false) {
            res.send({ success: true });
        }

        if (havePermission === 0 && existed === false) {
            res.send({ success: true });
        }

        if (havePermission === 1 && existed === false) {
            const insertRoleDetail = await conn.insert(`
                INSERT INTO    
            `)
        }
    } catch (error) {
        console.log(error);
    }
}