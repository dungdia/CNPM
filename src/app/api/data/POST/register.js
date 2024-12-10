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

    if(isEmpty) {
        res.send({ message: "Không được để trống các trường dữ liệu", success: false })
        return
    } else if(!regexUsername) {
        res.send({ message: "Username không hợp lệ", success: false })
        return
    } else if(!regexPassword) {
        res.send({ message: "Password phải từ 8 kí tự trở lên", success: false })
        return
    } else if(!checkPassword) {
        res.send({ message: "Password và confirm password phải giống nhau", success: false })
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
            conn.closeConnect()
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
            conn.closeConnect()
            return    
        }


        const [{user_id}] = await conn.select(`SELECT LAST_INSERT_ID() as user_id`)
        // console.log(user_id)

        const insertClient = await conn.insert(`INSERT INTO khachhang (id_taikhoan) VALUES (?)`,[user_id])

        if(insertClient.status != 200){
            res.send({message: "Đã xảy ra lỗi trong lúc đăng ký", success: false})
            conn.closeConnect()
            return    
        }

        const [{khachhang_id}] = await conn.select(`SELECT LAST_INSERT_ID() as khachhang_id`)

        const insertCart = await conn.insert(`INSERT INTO giohang (id_khachhang) VALUES (?)`,[khachhang_id])

        if(insertCart.status != 200){
            res.send({message: "Đã xảy ra lỗi trong lúc đăng ký", success: false})
            conn.closeConnect()
            return    
        }

        res.send({ message: "Đăng ký tài khoản thành công", success: true })
        conn.closeConnect()
    } catch (error) {
        console.error("Error fetching usernames:", error);
        res.send({ message: "Lỗi không thể thực hiện việc đăng ký", success: false })
    }
}