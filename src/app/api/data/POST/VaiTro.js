module.exports = async (req, res) => {
  const { id_vaitro, ten_vaitro, data, newtrangthai, type } = req.body;

  if (!type) {
    res.send({ success: false, message: "Không có type" });
    return;
  }
  try {
    const DBconnecter = require("../../../controller/DBconnecter");
    const conn = new DBconnecter();

    switch (type) {
      case "insert":
        if (!ten_vaitro) {
          res.send({ success: false, message: "Không có tên vai trò" });
          return;
        }
        if (!data) {
          res.send({ success: false, message: "không có danh sách quyền" });
          return;
        }
        const tenVaitro = await conn.select(
          `SELECT * FROM vaitro WHERE ten_vaitro=?`,
          [ten_vaitro]
        );
        if (tenVaitro.length > 0) {
          conn.closeConnect();
          res.send({ success: false, message: "Tên vai trò đã tồn tại" });
          return;
        }

        const roleResult = await conn.insert(
          `INSERT INTO vaitro (ten_vaitro) VALUES (?)`,
          [ten_vaitro]
        );

        if (roleResult.status != 200) {
          conn.closeConnect();
          res.send({ success: false, message: "Thêm vai trò thất bại" });
          return;
        }

        const id_role = await conn.lastId();

        for (const id_permission of data) {
          const permissionResult = await conn.insert(
            `INSERT INTO ctquyen (id_vaitro,id_quyen) VALUES (?,?)`,
            [id_role, id_permission]
          );

          if (permissionResult.status != 200) {
            conn.closeConnect();
            res.send({ success: false, message: "Thêm quyền thất bại" });
            return;
          }
        }
        conn.closeConnect();
        res.send({ success: true, message: "Thêm vai trò thành công" });
        break;
      case "edit":
        if (!id_vaitro) {
          res.send({ success: false, message: "không có id vai trò" });
          return;
        }
        if (id_vaitro == 1 || id_vaitro == 2) {
          res.send({ success: false, message: "Không được sửa vai trò này" });
          return;
        }

        if (!ten_vaitro) {
          res.send({ success: false, message: "Không có tên vai trò" });
          return;
        }
        if (!data) {
          res.send({ success: false, message: "không có danh sách quyền" });
          return;
        }
        const tenVaitroEdit = await conn.select(
          `SELECT * FROM vaitro WHERE ten_vaitro=? and id_vaitro != ?`,
          [ten_vaitro, id_vaitro]
        );
        if (tenVaitroEdit.length > 0) {
          conn.closeConnect();
          res.send({ success: false, message: "Tên vai trò đã tồn tại" });
          return;
        }

        const updateNameResult = await conn.update(
          `UPDATE vaitro SET ten_vaitro =? WHERE id_vaitro=?`,
          [ten_vaitro, id_vaitro]
        );

        if (updateNameResult.status != 200) {
          res.send({ success: false, message: "sửa tên vai trò thất bại" });
          return;
        }
        //clean permission detail
        const removeOldPermissionDetail = await conn.delete(
          `DELETE FROM ctquyen WHERE id_vaitro=?`,
          [id_vaitro]
        );

        for (const id_permission of data) {
          const permissionResult = await conn.insert(
            `INSERT INTO ctquyen (id_vaitro,id_quyen) VALUES (?,?)`,
            [id_vaitro, id_permission]
          );

          if (permissionResult.status != 200) {
            conn.closeConnect();
            res.send({ success: false, message: "Thêm quyền thất bại" });
            return;
          }
        }
        conn.closeConnect();
        res.send({ success: true, message: "Sửa quyền thành công" });
        break;
      case "lock":
        if (!id_vaitro) {
          res.send({ success: false, message: "không có id vai trò" });
          return;
        }
        if (id_vaitro == 1 || id_vaitro == 2) {
          res.send({ success: false, message: "Không được sửa vai trò này" });
          return;
        }
        if (newtrangthai === undefined || newtrangthai === null) {
          res.send({ success: false, message: "không có trạng thái mới" });
          return;
        }

        if (newtrangthai != 1 && newtrangthai != 0) {
          res.send({
            success: false,
            message: "Trạng thái chỉ có thể là 1 hoặc 0",
          });
          return;
        }

        if (newtrangthai == 0) {
          const checkDependency = await conn.select(
            `SELECT * FROM taikhoan WHERE vaitro_id = ?`,
            [id_vaitro]
          );
          if (checkDependency.length > 0) {
            res.send({
              success: false,
              message: "Không thể khoá vì còn tài khoản giữa vai trò này",
            });
            return;
          }
        }

        const lockResult = await conn.update(
          `UPDATE vaitro SET trangthai=? WHERE id_vaitro = ?`,
          [newtrangthai, id_vaitro]
        );

        if (lockResult.status != 200) {
          conn.closeConnect();
          res.send({ success: false, message: "Sửa vai trò thất bại" });
          return;
        }
        conn.closeConnect();
        res.send({ success: true, message: "Cập nhật thành công" });
        break;
      default:
        conn.closeConnect();
        res.send({
          success: false,
          message: "Không có loại chức năng tương ứng",
        });

        break;
    }
  } catch (error) {
    console.log(error);
  }
};
