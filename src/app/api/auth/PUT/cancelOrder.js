const decodeJWT = require("../../../../utils/decodeJWT");

module.exports = async (req, res) => {
  const { order_id } = req.body;

  if (!order_id) {
    res.send({ success: false, message: "Không có id hoá đơn" });
    return;
  }

  const token = req.cookies.access_token;
  const { payload } = await decodeJWT(token);

  try {
    const DBConnecter = require("../../../controller/DBconnecter");
    const conn = new DBConnecter();
    const hoadon = await conn.select(
      `SELECT id_trangthaiHD FROM hoadon
    JOIN khachhang ON khachhang.id_khachhang = hoadon.id_khachhang
    JOIN taikhoan ON taikhoan.id_taikhoan = khachhang.id_taikhoan
    WHERE taikhoan.user_name = ? AND id_hoadon=?`,
      [payload.username, order_id]
    );
    if (hoadon.length <= 0) {
      conn.closeConnect();
      res.send({ success: false, message: "Không thể tìm được hoá đơn này" });
      return;
    }
    if (hoadon[0].id_trangthaiHD > 2) {
      conn.closeConnect();
      res.send({ success: false, message: "không thể huỷ được hoá đơn này" });
      return;
    }
    const result = await conn.update(
      `UPDATE hoadon SET id_trangthaiHD = 5 WHERE id_hoadon=?`,
      [order_id]
    );
    if (result.status != 200) {
      conn.closeConnect();
      res.send({
        success: false,
        message: "Đã xảy ra lỗi trong lúc huỷ hoá đơn",
      });
      return;
    }
    conn.closeConnect();
    res.send({ success: true, message: "Huỷ hoá đơn thành công" });
  } catch (error) {
    console.log(error);
  }
};
