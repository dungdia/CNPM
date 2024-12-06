function sendFail(res, messsage) {
  res.send({
    success: false,
    data: messsage
  })
  return
}

module.exports = async (req, res) => {
  //itemPerPage (Number), page? (number) 
  const parameterList = []
  const params = req.query;

  if (!params.itemPerPage) {
    sendFail(res, "không có số sản phẩm mỗi trang")
    return;
  }
  const itemPerPage = params.itemPerPage;
  let page = 1;
  if (params.page) page = params.page;

  if (page <= 0) {
    sendFail(res, "số page phải lớn hơn không")
    return
  }

  const Constant = require('../../../../config/Constant')
  let lowestPrice = 0
  let highestPrice = Number.MAX_SAFE_INTEGER
  if (params.lowestPrice) lowestPrice = params.lowestPrice
  if (params.highestPrice) highestPrice = params.highestPrice
  if (lowestPrice < 0) lowestPrice = 0
  if (highestPrice < 0) highestPrice = 0
  if (highestPrice < lowestPrice) {
    sendFail(res, "giá trị giá cao nhất không được nhỏ hơn giá thấp nhất")
    return
  }
  parameterList.push(Number.parseInt(lowestPrice / Constant.profit), Number.parseInt(highestPrice / Constant.profit))
  // console.log(parameterList)

  let ram
  if (params.ram) {
    ram = params.ram
  }
  if (ram <= 0) {
    sendFail(res, "số lượng ram phải lớn hơn không")
    return
  }
  if (ram) parameterList.push(ram)

  let dung_luong
  if (params.dung_luong) dung_luong = params.dung_luong

  if (dung_luong <= 0) {
    sendFail(res, "số lượng dung lượng phải lớn hơn không")
    return
  }
  if (dung_luong) parameterList.push(dung_luong)

  let thuonghieu
  if (params.thuonghieu) {
    thuonghieu = params.thuonghieu
    parameterList.push(thuonghieu)
  }

  let productName = ""
  if (params.productName) productName = params.productName
  parameterList.push(`%${productName}%`)

  const pageStartPoint = (page - 1) * itemPerPage
  parameterList.push(pageStartPoint, itemPerPage * 1)


  //database access
  //test data {ram: 32, hard_drive: 52, name: est}
  try {
    const DBConnecter = require("../../../controller/DBconnecter");
    const conn = new DBConnecter();
    const productList = await conn.select(`SELECT id_sanpham,ten_sanpham,heDieuHanh, ram,dung_luong, ten_thuonghieu, gia FROM(
      SELECT ROW_NUMBER() OVER(PARTITION BY sanpham.id_sanpham) c,sanpham.id_sanpham,sanpham.ten_sanpham,sanpham.heDieuHanh, phienbansanpham.ram,phienbansanpham.dung_luong, thuonghieu.ten_thuonghieu, ctphieunhap.gia
          FROM sanpham 
              LEFT JOIN phienbansanpham ON phienbansanpham.id_sanpham = sanpham.id_sanpham 
              LEFT JOIN thuonghieu ON sanpham.id_thuonghieu = thuonghieu.id_thuonghieu 
              LEFT JOIN ctphieunhap ON ctphieunhap.id_phienbansp = phienbansanpham.id_phienban
          WHERE phienbansanpham.id_sanpham
        AND ctphieunhap.gia BETWEEN ? AND ?
        ${ram ? `AND RAM = ?` : ""}
      ${dung_luong ? `AND dung_luong = ?` : ""}
      ${thuonghieu ? `AND ten_thuonghieu = ?` : ""}
        AND ten_sanpham LIKE N?
  ) t WHERE c=1 LIMIT ?,?`, parameterList)
    const productData = []

    for (const item of productList) {
      const { gia, ...probs } = item
      const newGia = Math.ceil(gia * Constant.profit)
      productData.push({ ...probs, gia: newGia })
    }
    res.send({ success: true, data: productData })
    conn.closeConnect()
  } catch (error) {
    res.send(error);
  }
};
