import { fetchProductData } from "./product.js";

function checkUser() {
  const loginDisplay = document.getElementsByClassName("login-display");
  const loginBtn = document.getElementById("login-btn");

  if (!loginDisplay || !loginBtn) return;

  const user = localStorage.getItem("token");
  //kiểm tra user ở đây từ từ viết
  if (!user) {
    loginBtn.classList.remove("visually-hidden");

    for (const btn of loginDisplay) {
      btn.classList.add("visually-hidden");
    }

    return;
  }

  loginBtn.classList.add("visually-hidden");
  for (const btn of loginDisplay) {
    btn.classList.remove("visually-hidden");
  }
}

async function renderProductList() {
  const [productList] = document.getElementsByClassName("product-list");
  if(!productList){
    return;
  }
  const productData = await fetchProductData(8);
  const products = [];
  for (const product of productData) {
    products.push(product);
  }
  const VND = new Intl.NumberFormat("Vi-VN", {
    style: "currency",
    currency: "VND",
  });

  productList.innerHTML = products
    .map(
      (product) => `
  <a href="/product?id=${
    product.id_sanpham
  }" class="product mx-1 border border-secondary rounded-4 link-underline link-underline-opacity-0">
  <img src="/img/${product.ten_sanpham}" class="card-img-top p-2" alt="...">

  <div class="card-body m-2">
    <h5 class="card-title text-center fs-3 text-dark fw-bold">${
      product.ten_sanpham
    }</h5>
    <p class="card-text my-4 fs-4 fw-bold text-danger">${
      product.productPrice.gia == 0
        ? "Comming Soon!"
        : VND.format(product.productPrice.gia)
    }</p>
  </div>
</a>
  `
    )
    .join("");
}

checkUser();
renderProductList();
