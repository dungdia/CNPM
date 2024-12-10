const convertToDateTime = require("../../../../utils/convertToDateTime");

module.exports = async (req, res) => {
  const { baohanh_id, order_id, imei, issue, sendBackDate, type } = req.body;

  console.log(req.body);

  if (!type) {
    res.send({ success: false, message: "không có loại" });
    return;
  }

  if (!order_id || !imei || !issue || !sendBackDate) {
    res.send({ success: false, message: "Không đủ tham số" });
  }

  try {
    const DBConnecter = require("../../../controller/DBconnecter");
    const conn = new DBConnecter();

    switch (type) {
      case "add":
        const addResult = await conn.insert(
          `INSERT INTO phieubaohanh (imei,id_hoadon,ngay_BaoHanh,ngay_tra,Tinh_trang_may) 
        VALUES (?,?,CURDATE(),?,?)`,
          [imei, order_id, convertToDateTime(new Date(sendBackDate)), issue]
        );

        if (addResult.status != 200) {
          conn.closeConnect();
          res.send({ success: false, message: "Tạo phiếu bảo hành thất bại" });
          return;
        }
        conn.closeConnect();
        res.send({ success: true, message: "Thêm phiếu bảo hành thành công" });

        break;
      case "edit":
        if (!baohanh_id) {
          res.send({ success: false, message: "Không có id phiếu bảo hành" });
          return;
        }

        const editResult = await conn.update(
          `UPDATE phieubaohanh 
        SET imei=?,id_hoadon=?,ngay_tra=?,Tinh_trang_may=? WHERE id_phieubaohanh=?`,
          [
            imei,
            order_id,
            convertToDateTime(new Date(sendBackDate)),
            issue,
            baohanh_id,
          ]
        );

        if (editResult.status != 200) {
          conn.closeConnect();
          res.send({ success: false, message: "Sửa phiếu bảo hành thất bại" });
          return;
        }
        conn.closeConnect();
        res.send({ success: true, message: "Sửa phiếu bảo hành thành công" });

        break;

      default:
        conn.closeConnect();
        break;
    }
  } catch (error) {
    console.log(error);
  }
};
