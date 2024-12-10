module.exports = async (req, res) => {
  try {
    const DBConnecter = require("../../../controller/DBconnecter");
    const conn = new DBConnecter();
    const cthoadon = await conn.select(
      `SELECT * FROM cthoadon WHERE ngaykethuc_baohanh > CURRENT_DATE`
    );
    conn.closeConnect();
    res.json(cthoadon);
  } catch (error) {
    console.log(error);
  }
};
