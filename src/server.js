require("ejs");
const express = require("express");
const path = require("path");
const getAllFile = require("./utils/getAllFile");
const setUpREST = require("./utils/setUpREST");

const app = express();

app.use("/assets", express.static(path.join(__dirname, "assets")));

// setting view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

async function apiHandler() {
  //setup api với mỗi file trong app/api
  const folders = await getAllFile(path.join(__dirname, "app", "api"));

  for (const folder of folders) {
    const parent = folder.split("/").pop();
    await setUpREST(app, path.join(__dirname, "app", "api"), parent);
  }
}

async function viewsHandler() {
  const viewFolder = await getAllFile(path.join(__dirname, "views", "pages"));

  for (const page of viewFolder) {
    //lấy tên trang để setup đường dẫn
    const pageName = page.split("/").pop().replace(".ejs", "");
    app.get(`/${pageName}`, (req, res) => {
      res.render(page);
    });
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
        conn.closeConnect()
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

productImgApi();

apiHandler();

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/index", function (req, res) {
  res.render("index");
});

viewsHandler();

app.listen(process.env.PORT || 3000, () => {
  console.log(`Running on: http://localhost:${process.env.PORT}`);
});
