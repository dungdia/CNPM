const decodeJWT = require("../../../../utils/decodeJWT")

module.exports = async (req, res) => {
    const token = req.cookies.access_token
    const {payload} = await decodeJWT(token)

    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();
        const customerInfomation = await conn.select(`SELECT ho_ten, diachi, sodienthoai, gioi_tinh FROM khachhang, taikhoan WHERE khachhang.id_taikhoan = taikhoan.id_taikhoan AND user_name = ?`, [payload.username]);
        const data = [];
        for(const item of customerInfomation) {
            data.push(item);
        }
        res.send(customerInfomation);
        conn.closeConnect();
    } catch (error) {
        res.send(error)
    }
}