const bcrypt = require("bcryptjs");
const { DateTime } = require('luxon');
const Validator = require('../../../../utils/validator')

module.exports = async (req, res) => {
    const nowInVietnam = DateTime.now().setZone('Asia/Ho_Chi_Minh'); // Set to Vietnam timezone
    const formattedDate = nowInVietnam.toFormat('yyyy-MM-dd HH:mm:ss');

    const { username, password, confirmPassword } = req.body;
    const dataList = [username, password, confirmPassword];

    const isEmpty = dataList.some(Validator.isEmpty);
    const regexUsername = Validator.regexUsername(username);
    const regexPassword = Validator.regexPassword(password);
    const checkPassword = Validator.checkPassword(password, confirmPassword);

    if (
        isEmpty ||
        !regexUsername ||
        !regexPassword ||
        !checkPassword
    ) {
        res.send({ message: "Lỗi định dạng dữ liệu", success: false })
        return
    }

    try {
        const DBConnecter = require("../../../controller/DBconnecter");
        const conn = new DBConnecter();

        const usernameList = await conn.select(`
            SELECT user_name as username
            FROM taikhoan
            WHERE user_name = ?
        `, [username]);

        if (usernameList.length > 0) {
            res.send({ message: "Tên tài khoản đã tồn tại", success: false })
            return;
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const insertUser = await conn.insert(`
                INSERT INTO taikhoan (user_name, password, ngaythamgia)
                VALUES (?, ?, ?)
            `,
            [username, hashedPassword, formattedDate])
            
        if(insertUser.status != 200){
            res.send({message: "Đã xảy ra lỗi trong lúc đăng ký", success: false})
            return    
        }


        const [{user_id}] = await conn.select(`SELECT LAST_INSERT_ID() as user_id`)

        const insertClient = await conn.insert(`INSERT INTO khachhang (id_taikhoan) VALUES (?)`,[user_id])

        if(insertClient.status != 200){
            res.send({message: "Đã xảy ra lỗi trong lúc đăng ký", success: false})
            return    
        }

        const [{khachhang_id}] = await conn.select(`SELECT LAST_INSERT_ID() as khachhang_id`)

        const insertCart = await conn.insert(`INSERT INTO giohang (id_khachhang) VALUES (?)`,[khachhang_id])

        if(insertCart.status != 200){
            res.send({message: "Đã xảy ra lỗi trong lúc đăng ký", success: false})
            return    
        }

        res.send({ message: "Đăng ký tài khoản thành công", success: true })
    } catch (error) {
        console.error("Error fetching usernames:", error);
        res.send({ message: "Lỗi không thể thực hiện việc đăng ký", success: false })
    }
}