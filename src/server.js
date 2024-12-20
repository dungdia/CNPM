require("ejs");
const Validator = require("./utils/validator");
const express = require("express");
const path = require("path");
const getAllFile = require("./utils/getAllFile");
const bodyParser = require("body-parser");
const setUpREST = require("./utils/setUpREST");
const cookieParser = require("cookie-parser");
const multer = require("multer");

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use("/assets", express.static(path.join(__dirname, "assets")));

// setting view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

async function apiHandler() {
  //setup api với mỗi file trong app/api
  const folders = await getAllFile(path.join(__dirname, "app", "api"));

  for (const folder of folders) {
    const parent = folder.split("\\").pop();
    await setUpREST(app, path.join(__dirname, "app", "api"), parent);
  }
}

async function viewsHandler() {
  const authMiddleWare = require("./utils/authMiddleWare");
  const roleMiddleWare = require("./utils/roleMiddleWare");
  const viewFolder = await getAllFile(path.join(__dirname, "views", "pages"));
  const adminFolder = await getAllFile(path.join(__dirname, "views", "admin"));
  const requireLoginPage = ["cart", "order", "orderDetail", "user-info"];

  for (const page of viewFolder) {
    //lấy tên trang để setup đường dẫn

    const pageName = page.split("\\").pop().replace(".ejs", "");

    app.get(
      `/${pageName}`,
      requireLoginPage.includes(pageName)
        ? authMiddleWare
        : (req, res, next) => {
            next();
          },
      (req, res) => {
        res.render(page);
      }
    );
  }

  for (const page of adminFolder) {
    const pageName = page.split("\\").pop().replace(".ejs", "");
    app.get(
      `/admin/${pageName}`,
      authMiddleWare,
      roleMiddleWare,
      async (req, res) => {
        try {
          const vaitro_id = req.cookies.vaitro_id;
          const DBConnecter = require("./app/controller/DBconnecter");
          const conn = new DBConnecter();
          const permissionList = await conn.select(
            `SELECT * FROM ctquyen WHERE id_vaitro = ?`,
            [vaitro_id]
          );
          const data = [];
          for (const item of permissionList) {
            data.push(item.id_quyen);
          }

          conn.closeConnect();
          res.render(page, { data: data });
        } catch (error) {
          console.log(error);
        }
      }
    );
  }
}

async function productImgApi() {
  app.get(`/img/:ten_sanpham`, async (req, res) => {
    try {
      const DBConnecter = require("./app/controller/DBconnecter");
      const conn = new DBConnecter();
      // console.log(req.params)
      const product = await conn.select(
        `SELECT hinh_anh FROM sanpham WHERE sanpham.ten_sanpham = "${req.params.ten_sanpham}"`
      );

      // res.send(product.length)
      if (product.length <= 0 || !product[0].hinh_anh) {
        res.sendFile(path.join(__dirname, "assets", "image", "default.jpg"));
        conn.closeConnect();
        return;
      }

      res.contentType("png");
      res.send(product[0].hinh_anh);
      conn.closeConnect();
    } catch (error) {
      res.sendFile(path.join(__dirname, "assets", "image", "default.jpg"));
    }
  });
}

async function insertProduct() {
  app.post(
    "/api/data/addSanPham",
    upload.single("hinh_anh"),
    async (req, res) => {
      const {
        ten_sanpham,
        kichThuocMan,
        cameraSau,
        cameraTruoc,
        chipXuLy,
        heDieuHanh,
        dungLuongPin,
        id_thuonghieu,
      } = req.body;
      const image = req.file ? req.file.buffer : null;
      console.log(req.body, req.file);

      switch (true) {
        case !Validator.regexText(ten_sanpham):
          return res.json({
            message: "Tên sản phẩm không được để trống và quá 255 ký tự",
            success: false,
          });
        case !Validator.isNumber(kichThuocMan):
          return res.json({
            message:
              "Kích thước màn hình không được để trống, là số và lớn hơn 0",
            success: false,
          });
        case !Validator.regexText(cameraSau):
          return res.json({
            message: "Camera sau không được để trống và quá 255 ký tự",
            success: false,
          });
        case !Validator.regexText(cameraTruoc):
          return res.json({
            message: "Camera trước không được để trống và quá 255 ký tự",
            success: false,
          });
        case !Validator.regexText(chipXuLy):
          return res.json({
            message: "Chip xử lí không được để trống và quá 255 ký tự",
            success: false,
          });
        case !Validator.regexText(heDieuHanh):
          return res.json({
            message: "Hệ điều hành không được để trống và quá 255 ký tự",
            success: false,
          });
        case !Validator.isNumber(dungLuongPin):
          return res.json({
            message: "Dung lượng pin không được để trống",
            success: false,
          });
        case !req.file || !imageExtension(req.file.originalname):
          return res.json({
            message: "Vui lòng chọn ảnh ảnh với định dạng jpg, jpeg, png, gif",
            success: false,
          });
      }

      try {
        const DBConnecter = require("./app/controller/DBconnecter");
        const conn = new DBConnecter();

        const insertSanPham = await conn.insert(
          `
        INSERT INTO cnpm.sanpham
        (ten_sanpham, kichThuocMan, cameraSau, cameraTruoc, chipXuLy, heDieuHanh, dungLuongPin, id_thuonghieu, hinh_anh)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
          [
            ten_sanpham,
            kichThuocMan,
            cameraSau,
            cameraTruoc,
            chipXuLy,
            heDieuHanh,
            dungLuongPin,
            id_thuonghieu,
            image,
          ]
        );

        if (insertSanPham.status !== 200) {
          return res.json({
            message: "Thêm sản phẩm không thành công",
            success: false,
          });
        }

        conn.closeConnect();
        res.json({ message: "Thêm sản phẩm thành công", success: true });
      } catch (error) {
        res.json({ message: "Lỗi", success: false });
      }
    }
  );
}

async function updateProduct() {
  app.post(
    "/api/data/updateSanPham",
    upload.single("hinh_anh"),
    async (req, res) => {
      const {
        ten_sanpham,
        kichThuocMan,
        cameraSau,
        cameraTruoc,
        chipXuLy,
        heDieuHanh,
        dungLuongPin,
        id_thuonghieu,
        id_sanpham,
        trangThai,
        type,
      } = req.body;
      const image = req.file ? req.file.buffer : null;
      console.log(req.body, req.file);

      if (type != "lock" || !type)
        switch (true) {
          case !Validator.regexText(ten_sanpham):
            return res.json({
              message: "Tên sản phẩm không được để trống và quá 255 ký tự",
              success: false,
            });
          case !Validator.isNumber(kichThuocMan):
            return res.json({
              message:
                "Kích thước màn hình không được để trống, là số và lớn hơn 0",
              success: false,
            });
          case !Validator.regexText(cameraSau):
            return res.json({
              message: "Camera sau không được để trống và quá 255 ký tự",
              success: false,
            });
          case !Validator.regexText(cameraTruoc):
            return res.json({
              message: "Camera trước không được để trống và quá 255 ký tự",
              success: false,
            });
          case !Validator.regexText(chipXuLy):
            return res.json({
              message: "Chip xử lí không được để trống và quá 255 ký tự",
              success: false,
            });
          case !Validator.regexText(heDieuHanh):
            return res.json({
              message: "Hệ điều hành không được để trống và quá 255 ký tự",
              success: false,
            });
          case !Validator.isNumber(dungLuongPin):
            return res.json({
              message: "Dung lượng pin không được để trống",
              success: false,
            });
          case !req.file || !imageExtension(req.file.originalname):
            return res.json({
              message:
                "Vui lòng chọn ảnh ảnh với định dạng jpg, jpeg, png, gif",
              success: false,
            });
        }

      try {
        const DBConnecter = require("./app/controller/DBconnecter");
        const conn = new DBConnecter();

        let updateSanPham;

        if (trangThai) {
          console.log("LOCK");
          updateSanPham = await conn.update(
            `
          UPDATE cnpm.sanpham
          SET trangThai = ?
          WHERE id_sanpham = ?
        `,
            [trangThai, id_sanpham]
          );

          if (updateSanPham.status !== 200) {
            return res.json({
              message: "Khóa sản phẩm không thành công",
              success: false,
            });
          }

          conn.closeConnect();
          res.json({ message: "Khóa sản phẩm thành công", success: true });
        } else {
          const agrs = [
            ten_sanpham,
            kichThuocMan,
            cameraSau,
            cameraTruoc,
            chipXuLy,
            heDieuHanh,
            dungLuongPin,
            id_thuonghieu,
          ];
          if (image) agrs.push(image);
          agrs.push(id_sanpham);
          // console.log(image)
          updateSanPham = await conn.update(
            `
          UPDATE cnpm.sanpham
          SET ten_sanpham = ?, 
              kichThuocMan = ?, 
              cameraSau = ?, 
              cameraTruoc = ?, 
              chipXuLy = ?, 
              heDieuHanh= ?, 
              dungLuongPin = ?, 
              id_thuonghieu = ?
          ${!image ? `` : `,hinh_anh = ?`}  
          WHERE id_sanpham = ?
        `,
            agrs
          );

          if (updateSanPham.status !== 200) {
            return res.json({
              message: "Sửa sản phẩm không thành công",
              success: false,
            });
          }

          conn.closeConnect();
          res.json({ message: "Sửa sản phẩm thành công", success: true });
        }
      } catch (error) {
        res.json({ message: "Lỗi", success: false });
      }
    }
  );
}

insertProduct();
updateProduct();

productImgApi();

apiHandler();

app.get(["/", "/index"], function (req, res) {
  res.render("index");
});

viewsHandler();

// function productId() {
//   app.get("/productDetail", (req, res) => {
//     console.log(req.query.id)
//     res.send({ message: "OK"})
//   })
// }
// productId()

app.listen(process.env.PORT || 3000, () => {
  console.log(`Running on: http://localhost:${process.env.PORT}`);
});
