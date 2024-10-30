import { fetchProductData,renderProductList } from "./product.js";



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

checkUser();


