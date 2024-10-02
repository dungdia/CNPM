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
  let Page = 1;
  if (params.Page) Page = params.Page;

  //database access

  try {
    const DBConnecter = require("../../../controller/DBconnecter");
    const conn = new DBConnecter();
    const productList = await conn.select(
      `SELECT id_sanpham,ten_sanpham,ten_thuonghieu FROM(
        SELECT ROW_NUMBER() over(ORDER BY id_sanpham) as row_num,id_sanpham,ten_sanpham,ten_thuonghieu 
          FROM sanpham sp,thuonghieu th 
          WHERE th.id_thuonghieu = sp.id_thuongthieu 
          AND sp.trangThai = 1 ) as t 
      WHERE t.row_num BETWEEN ${(Page - 1) * itemPerPage + 1} AND ${
        Page * itemPerPage
      }`
    );

    const productData = [];
    for (const product of productList) {
      //   const json = JSON.stringify(product);
      //   console.log(product.id_sanpham);
      const productTypeList = await conn.select(
        `SELECT gia FROM sanpham,phienbansanpham,ctphieunhap 
        WHERE sanpham.id_sanpham = phienbansanpham.id_sanpham 
        AND phienbansanpham.id_phienban = ctphieunhap.id_phienbansp 
        AND sanpham.id_sanpham = ${product.id_sanpham} LIMIT 1;`
      );
      //   console.log(productTypeList.length);
      if (productTypeList.length <= 0) {
        productData.push({ ...product, productPrice: { gia: 0 } });
        continue;
      }
      const [productPrice] = productTypeList;
      const Constant = require("../../../../config/Constant");
      productPrice.gia = Constant.profit * productPrice.gia;
      productData.push({ ...product, productPrice });
    }
    // res.send("test");
    res.send(productData);
  } catch (error) {
    res.send(error);
  }
};
