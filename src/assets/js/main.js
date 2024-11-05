// import { fetchProductData,renderProductList } from "./product.js";

export function getNewToken(callback){

}

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

const logoutBtn = document.getElementById("logout_button");
logoutBtn.onclick = () => {
    console.log("alo djt me")
    const popupContainer = document.getElementById("popup_container");
    const popup = document.getElementById("popup");
    const [body] = document.getElementsByTagName("body");
    popupContainer.style.top = "0%";

    document.onkeydown = (e) => {
        if(e.key == "Escapse"){
            popupContainer.style.top = "-150%";
        }
        body.style.overflowY = "scroll";
    }

    popup.innerHTML = `
    <div class="popup_logout_confirm">
        <p class="popup_logout_confirm_text" style="font-size: 24px">Are you sure want to log out?</p>
        <button class="popup_logout_confirm_yesBtn" id="popup_logout_confirm_yesBtn">Yes</button>
        <button class="popup_logout_confirm_noBtn" id="popup_logout_confirm_noBtn">No</button>
      </div>
    `;
    body.style.overflow = "hidden";

    const yesBtn = document.getElementById("popup_logout_confirm_yesBtn");
    const noBtn = document.getElementById("popup_logout_confirm_noBtn");

    noBtn.onclick = () => {
        popupContainer.style.top = "-150%";
        body.style.overflowY = "scroll";
        console.log("no btn")
    }

    yesBtn.onclick = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        window.location = "/";
    }
}


