const bcrypt = require("bcryptjs");
const Validator = require("../../../../utils/validator");

module.exports = async (req, res) => {
    // console.log(req.body);
    const { username, password } = req.body;

    const reqList = [username, password]

    const isEmpty = reqList.some((item) => Validator.isEmpty(item));

    if (isEmpty)
        return res.send({ message: "Vui lòng nhập đầy đủ thông tin" })
 
    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();

        const userList = await conn.select(`
            SELECT user_name,password,refesh_token
            FROM taikhoan
            WHERE user_name = ?
        `, [username]);

        if (userList.length == 0) {
            return res.send({ success: false, message: "Tài khoản không tồn tại" })
        }

        const verifiedPassword = await bcrypt.compare(password, userList[0].password);
        if (!verifiedPassword) {
            return res.send({ success: false, message: "Sai mật khẩu" })
        }

        const jwt = require("../../../../utils/jwt")
        const randToken = require("rand-token")

        const secretKey = process.env.JWT_SECRET_KEY
        const expireTime = process.env.JWT_TOKEN_LIFE

        const access_token = await jwt.generateToken({username:userList[0].user_name},secretKey,expireTime)
        let refesh_token
        if(!userList[0].refesh_token){
            refesh_token = randToken.generate(100)

            const updateToken = await conn.update("UPDATE taikhoan SET refesh_token=? WHERE user_name = ?",[refesh_token,username])
            if(updateToken.status != 200)
                return res.send({success:false, message: "lỗi khi tạo token"})
        }
        else{

            refesh_token = userList[0].refesh_token
        }

        // console.table({refesh_token: refesh_token,access_token: access_token})

        return res.send({ success: true, message: "Đăng nhập thành công", access_token: access_token, refesh_token: refesh_token })
    } catch (error) {
        console.log(error)
    }
}