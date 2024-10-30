const bcrypt = require("bcryptjs");

module.exports = async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;

    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();

        const passwordList = await conn.select(`
            SELECT password
            FROM taikhoan
            WHERE user_name = ?
        `, [username]);
        console.log(passwordList)
        if (passwordList.length == 0) {
            return res.send({ status: "1", message: "Tài khoản không tồn tại" })
        }
        
        const verifiedPassword = await bcrypt.compare(password, passwordList[0].password);

        if (!verifiedPassword) {
            return res.send({ status: "2", message: "Sai mat khau" })
        }

        return res.send({ status: "0", message: "Đăng nhập thành công" })
    } catch (error) {
        console.log(error)
    }
}