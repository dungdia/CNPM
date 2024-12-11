module.exports = async (req, res) => {
  const { id_vaitro } = req.query;

  try {
    const DBconnecter = require("../../../controller/DBconnecter");
    const conn = new DBconnecter();

    if (id_vaitro) {
      //Lấy bản chi tiết quyền

      const permissionDetailList = await conn.select(
        `SELECT * FROM ctquyen WHERE id_vaitro = ?`,
        [id_vaitro]
      );

      const respone = [];

      for (const item of permissionDetailList) {
        respone.push(item.id_quyen);
      }

      res.json(respone);

      return;
    }
    if (!id_vaitro) {
      //Nếu không có id vai trò lấy hết toàn bộ danh sách quyền
      const permissionList = await conn.select(`SELECT * FROM quyen`);
      conn.closeConnect();
      res.json(permissionList);
      return;
    }
    conn.closeConnect();
  } catch (error) {
    console.log(error);
  }
};
