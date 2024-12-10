module.exports = async (req, res) => {
  try {
    const DBconnecter = require("../../../controller/DBconnecter");
    const conn = new DBconnecter();
    const result = await conn.select(
      `SELECT id_phieubaohanh,id_hoadon,imei,ngay_BaoHanh,ngay_tra,Tinh_trang_may FROM phieubaohanh`
    );
    conn.closeConnect();
    res.json(result);
  } catch (error) {
    console.log(error);
  }
};
