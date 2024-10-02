module.exports = async (req, res) => {
  const params = req.query;

  if (!params.itemPerPage) {
    res.json({
      success: false,
      data: "không có số sản phẩm mỗi trang",
    });
    return;
  }
  const itemPerPage = params.itemPerPage;

  try {
    const DBConnecter = require("../../../controller/DBconnecter");
    const conn = new DBConnecter();
    const [totalProduct] = await conn.select(
      "SELECT COUNT(id_sanpham) as totalProduct FROM sanpham"
    );
    const totalPage = Math.floor(totalProduct.totalProduct / itemPerPage);
    res.send({ totalPage: totalPage });
  } catch (error) {
    res.send(error);
  }
};
