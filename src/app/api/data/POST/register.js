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
        !isEmpty &&
        regexUsername &&
        regexPassword &&
        checkPassword
    ) {
        try {
            const DBConnecter = require("../../../controller/DBconnecter");
            const conn = new DBConnecter();

            const usernameList = await conn.select(`
                SELECT user_name as username
                FROM taikhoan
                WHERE user_name = ?
            `, [username]);

            if (usernameList.length > 0) {
                res.send({ message: "1" })
                return;
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const insertUser = await conn.insert(`
                    INSERT INTO taikhoan (user_name, password, ngaythamgia)
                    VALUES (?, ?, ?)
                `,
                [username, hashedPassword, formattedDate])

            res.send({ message: "0" })
        } catch (error) {
            console.error("Error fetching usernames:", error);
        }
    } else {
        res.send({ message: "???!" })
    }
}