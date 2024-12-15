const bcrypt = require("bcryptjs");
const { DateTime } = require("luxon");
const Validator = require("../../../../utils/validator");
module.exports = async (req, res) => {
  console.log(req.body);

  const nowInVietnam = DateTime.now().setZone("Asia/Ho_Chi_Minh");
  const formattedDate = nowInVietnam.toFormat("yyyy-MM-dd HH:mm:ss");
  function message(msg, status) {
    return res.json({ message: msg, success: status });
  }

  try {
    const DBConnecter = require("../../../controller/DBconnecter");
    const conn = new DBConnecter();
    // INSERT TAIKHOAN
    if (req.body.query === "insert") {
      console.log("Insert");

      const {
        username,
        fullName,
        gender,
        phoneNumber,
        email,
        password,
        confirmPassword,
        roleId,
      } = req.body;

      if (
        !username ||
        !fullName ||
        !phoneNumber ||
        !email ||
        !password ||
        !confirmPassword
      ) {
        return res.json({
          message: "Vui lòng nhập đầy đủ thông tin",
          success: false,
        });
      }

      // switch (true) {
      //     case !Validator.checkUsername(username):
      //         console.log(!Validator.checkUsername(username));
      //         return res.json({ message: "Tên username phải từ 3 - 100 ký tự, không bắt đầu bằng khoảng trắng, không chứa kí tự đặc biệt và khoảng trắng", success: false}); break;
      //     case !Validator.checkFullname(fullName):
      //         return res.json({ message: "Tên nhân viên phải từ 3 - 100 kí tự, không bắt đầu bằng khoảng trắng và không chứa kí tự đặc biệt", success: false}); break;
      //     case !Validator.isPhoneNumber(phoneNumber):
      //         return res.json({ message: "Số điện thoại phải bắt đầu bằng số 0 và gồm 10 - 11 số", success: false}); break;
      //     case !Validator.checkEmail(email):
      //         return res.json({ message: "Vui lòng nhập email hợp lệ", success: false}); break;
      //     case !Validator.regexPassword(password):
      //         return res.json({ message: "Mật khẩu phải ít nhất 8 kí tự và không có khoảng trắng", success: false}); break;
      // }

      if (!Validator.checkUsername(username)) {
        console.log(!Validator.checkUsername(username));
        return res.json({
          message:
            "Username phải từ 3 - 100 ký tự, không bắt đầu bằng khoảng trắng, không chứa kí tự đặc biệt và khoảng trắng",
          success: false,
        });
      }

      if (!Validator.checkFullname(fullName)) {
        return res.json({
          message:
            "Tên nhân viên phải từ 3 - 100 kí tự, không bắt đầu bằng khoảng trắng và không chứa kí tự đặc biệt",
          success: false,
        });
      }

      if (!Validator.isPhoneNumber(phoneNumber)) {
        return res.json({
          message: "Số điện thoại phải bắt đầu bằng số 0 và gồm 10 - 11 số",
          success: false,
        });
      }

      if (!Validator.checkEmail(email)) {
        return res.json({
          message: "Vui lòng nhập email hợp lệ",
          success: false,
        });
      }

      if (!Validator.regexPassword(password)) {
        return res.json({
          message: "Mật khẩu phải ít nhất 8 kí tự và không có khoảng trắng",
          success: false,
        });
      }

      if (password !== confirmPassword) {
        return res.json({ message: "Mật khẩu không khớp", success: false });
      }

      const checkExistPhonenumber = await conn.select(
        `
                SELECT *
                FROM taikhoan tk
                join vaitro vt on vt.id_vaitro = tk.vaitro_id and vt.id_vaitro != 1 
                join nhanvien nv on nv.id_taikhoan = tk.id_taikhoan
                where nv.sodienthoai = ?`,
        [phoneNumber]
      );

      if (checkExistPhonenumber.length > 0) {
        return res.json({
          message: "Số điện thoại đã tồn tại",
          success: false,
        });
      }

      const checkExistUsername = await conn.select(
        `
                SELECT *
                FROM taikhoan tk
                join vaitro vt on vt.id_vaitro = tk.vaitro_id and vt.id_vaitro != 1 
                join nhanvien nv on nv.id_taikhoan = tk.id_taikhoan
                where tk.user_name = ?
            `,
        [username]
      );

      if (checkExistUsername.length > 0) {
        return res.json({
          message: "Tên tài khoản đã tồn tại",
          success: false,
        });
      }

      const checkExistEmail = await conn.select(
        `
                SELECT *
                FROM taikhoan tk
                join vaitro vt on vt.id_vaitro = tk.vaitro_id and vt.id_vaitro != 1 
                join nhanvien nv on nv.id_taikhoan = tk.id_taikhoan
                where nv.email = ?
            `,
        [email]
      );

      if (checkExistEmail.length > 0) {
        return res.json({ message: "Email đã tồn tại", success: false });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const insertTK = await conn.insert(
        `
                INSERT INTO taikhoan
                (user_name, password, vaitro_id, ngaythamgia)
                VALUES(?, ?, ?, ?);    
            `,
        [username, hashedPassword, roleId, formattedDate]
      );

      if (insertTK.status !== 200) {
        return res.json({
          message: "Thêm tài khoản nhân viên thất bại",
          success: false,
        });
      }

      const lastId = await conn.lastId();

      const insertNV = await conn.insert(
        `
                INSERT INTO nhanvien
                (id_taikhoan, ho_ten, gioi_tinh, sodienthoai, email)
                VALUES(?, ?, ?, ?, ?);
            `,
        [lastId, fullName, gender, phoneNumber, email]
      );

      if (insertNV.status !== 200) {
        return res.json({
          message: "Thêm tài khoản nhân viên thất bại",
          success: false,
        });
      }

      return res.json({
        message: "Thêm tài khoản nhân viên thành công",
        success: true,
      });
    }
    // UPDATE TAIKHOAN
    if (req.body.query === "update") {
      const {
        id_nhanvien,
        id_taikhoan,
        username,
        fullName,
        gender,
        phoneNumber,
        email,
        roleId,
      } = req.body;

      if (!fullName || !phoneNumber || !email) {
        return res.json({
          message: "Vui lòng nhập đầy đủ thông tin",
          success: false,
        });
      }

      if (!Validator.checkFullname(fullName)) {
        return res.json({
          message:
            "Tên nhân viên phải từ 3 - 100 kí tự, không bắt đầu bằng khoảng trắng và không chứa kí tự đặc biệt",
          success: false,
        });
      }

      if (!Validator.isPhoneNumber(phoneNumber)) {
        return res.json({
          message: "Số điện thoại phải bắt đầu bằng số 0 và gồm 10 - 11 số",
          success: false,
        });
      }

      if (!Validator.checkEmail(email)) {
        return res.json({
          message: "Vui lòng nhập email hợp lệ",
          success: false,
        });
      }

      const checkExistUsername = await conn.select(
        `
                SELECT *
                FROM taikhoan tk
                join vaitro vt on vt.id_vaitro = tk.vaitro_id and vt.id_vaitro != 1 
                join nhanvien nv on nv.id_taikhoan = tk.id_taikhoan and nv.id_nhanvien != ?
                where tk.user_name = ?
            `,
        [id_nhanvien, username]
      );

      if (checkExistUsername.length > 0) {
        return res.json({
          message: "Tên tài khoản đã tồn tại",
          success: false,
        });
      }

      const checkExistEmail = await conn.select(
        `
                SELECT *
                FROM taikhoan tk
                join vaitro vt on vt.id_vaitro = tk.vaitro_id and vt.id_vaitro != 1 and tk.id_taikhoan != ?
                join nhanvien nv on nv.id_taikhoan = tk.id_taikhoan and nv.id_nhanvien != ?
                where nv.email = ?
            `,
        [id_nhanvien, email]
      );

      if (checkExistEmail.length > 0) {
        return res.json({ message: "Email đã tồn tại", success: false });
      }

      const checkExistPhonenumber = await conn.select(
        `
                SELECT *
                FROM taikhoan tk
                join vaitro vt on vt.id_vaitro = tk.vaitro_id and vt.id_vaitro != 1 
                join nhanvien nv on nv.id_taikhoan = tk.id_taikhoan
                where nv.sodienthoai = ? AND nv.id_nhanvien != ?`,
        [phoneNumber, id_nhanvien]
      );

      if (checkExistPhonenumber.length > 0) {
        return res.json({
          message: "Số điện thoại đã tồn tại",
          success: false,
        });
      }

      const updateTK = await conn.update(
        `
                update cnpm.taikhoan tk
                set user_name = ?, vaitro_id = ?
                where tk.id_taikhoan = ?                        
            `,
        [username, roleId, id_taikhoan]
      );

      const updateNV = await conn.update(
        `
                UPDATE cnpm.nhanvien
                SET ho_ten = ?, gioi_tinh = ?, sodienthoai = ?, email = ?
                WHERE id_nhanvien = ?;
            `,
        [fullName, gender, phoneNumber, email, id_nhanvien]
      );

      if (updateTK.status !== 200 || updateNV.status !== 200) {
        return res.json({
          message: "Cập nhật tài khoản nhân viên thất bại",
          success: false,
        });
      }

      return res.json({
        message: "Cập nhật tài khoản nhân viên thành công",
        success: true,
      });
    }
    if (req.body.query === "delete") {
      const { id_nhanvien, id_taikhoan, trangthai } = req.body;
      console.log(trangthai);

      const updateStatusTK = await conn.update(
        `
                update cnpm.taikhoan tk
                set trangthai = ?
                where tk.id_taikhoan = ?       
            `,
        [trangthai, id_taikhoan]
      );

      const updateStatusNV = await conn.update(
        `
                UPDATE cnpm.nhanvien
                SET trangthai = ?
                WHERE id_nhanvien = ?;
            `,
        [trangthai, id_nhanvien]
      );

      if (updateStatusNV.status !== 200 || updateStatusTK.status !== 200) {
        return res.json({
          message: "Cập nhật trạng thái nhân viên thất bại",
          success: false,
        });
      }

      return res.json({
        message: "Cập nhật trạng thái nhân viên thành công",
        success: true,
      });
    }
  } catch (error) {
    res.json({ message: `${error}`, success: false });
  }
};
