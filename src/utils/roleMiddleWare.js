const decodeJWT = require("./decodeJWT");

module.exports = async (req, res, next) => {
  const token = req.cookies.access_token;
  const vaitro_id = req.cookies.vaitro_id;
  const { payload } = await decodeJWT(token);

  try {
    const DBconnecter = require("../app/controller/DBconnecter");
    const conn = new DBconnecter();
    const user = await conn.select(
      `SELECT * FROM taikhoan WHERE user_name = ?`,
      [payload.username]
    );

    conn.closeConnect();

    if (user[0].vaitro_id != vaitro_id) {
      res.send(`<script>alert("Không đúng vai trò của tài khoản")
      window.location = "/"
      </script>`);
      return;
    }
    if (vaitro_id <= 1) {
      res.send(`<script>alert("Không được phép truy cập vô khu vực admin")
        window.location = "/"
        </script>`);
      return;
    }
  } catch (error) {
    console.log(error);
    res.redirect("/");
    return;
  }

  next();
};
