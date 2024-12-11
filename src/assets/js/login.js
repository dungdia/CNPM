import { Validation } from "./validation.js";
import CookieManager from "https://cdn.jsdelivr.net/npm/js-cookie-manager@1.0.2/index.min.js";

const loginForm = document.getElementById("login-form__body");
const singinInputBody = document
  .getElementById("login-form__body")
  .querySelectorAll("input");
const signinInputUsername = document.getElementById(
  "login-form__input--username"
);
const singinInputPassword = document.getElementById(
  "login-form__input--password"
);
const allFeedback = document.querySelectorAll(".invalid-feedback");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  let valid = true;
  if (Validation.isFormBlank(singinInputBody)) {
    await loginData();
  }
});

let loginData = async () => {
  var formData = new FormData(loginForm);
  var data = Object.fromEntries(formData.entries());

  try {
    const res = await fetch(`/api/data/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorMessage = await res.text();
      throw new Error(`HTTP error! status: ${res.status} - ${errorMessage}`);
    }

    const resData = await res.json();
    if (!resData.success) {
      alert(resData.message);
      if (res.message === "Sai mật khẩu") {
        allFeedback[0].previousElementSibling.classList.remove("is-valid");
        allFeedback[1].textContent = resData.message;
        allFeedback[1].previousElementSibling.classList.remove("is-valid");
        allFeedback[1].previousElementSibling.classList.add("is-invalid");
      } else {
        allFeedback[1].previousElementSibling.classList.remove("is-valid");
        allFeedback[0].textContent = resData.message;
        allFeedback[0].previousElementSibling.classList.remove("is-valid");
        allFeedback[0].previousElementSibling.classList.add("is-invalid");
      }
      return;
    }
    console.log(resData);
    const { access_token, refesh_token, vaitro_id } = resData;
    // console.log(access_token ,"\n",refesh_token)
    // localStorage.setItem("refesh_token", refesh_token)
    // localStorage.setItem("token", access_token)
    // localStorage.setItem("login_account", login_account)
    alert("Đăng nhập thành công");

    const cookieManager = new CookieManager();
    cookieManager.set("access_token", access_token);
    cookieManager.set("refesh_token", refesh_token);
    // cookieManager.set("access_token",access_token)
    cookieManager.set("vaitro_id", vaitro_id);
    if (vaitro_id != 1) {
      window.location = "/admin/index";
    } else {
      window.location = "/";
    }
  } catch (error) {
    console.log(error);
  }
};
