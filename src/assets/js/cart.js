const payBtn = document.getElementById("cart-pay-btn");
const paymentPopup = document.getElementById("user-payment-info-popup-container");
const cancelBtn = document.getElementById("user-payment-info-cancel-button");
const confirmBtn = document.getElementById("user-payment-info-confirm-button");
const fullName = document.getElementById("user-fullName");
const phoneNumber = document.getElementById("user-phoneNumber");
const address = document.getElementById("user-address");
const email = document.getElementById("user-email");
const note = document.getElementById("user-note");
const [body] = document.getElementsByTagName("body");

document.addEventListener("DOMContentLoaded", () => {
    document.onkeydown = (event) => {
        if(event.key == "Escapse") {
            event.preventDefault();
            paymentPopup.style.top = "-150%";
            body.style.overflowY = "scroll";
        }

    }
    payBtn.onclick = () => {
        if(document.getElementById("cart-content-container").value == ""){
            alert("Không có sản phẩm trong giỏ hàng");
        } else {
            paymentPopup.style.top = "0%";
            body.style.overflow = "hidden";
        }
    }

    confirmBtn.onclick = () => {
        if(fullName.value == ""){
            alert("Họ và tên không được bỏ trống!");
            event.preventDefault();
            return;
        }
        if(phoneNumber.value == ""){
            alert("Số điện thoại không được bỏ trống");
            event.preventDefault();
            return;
        }
        if(address.value == ""){
            alert("Địa chỉ không được để trống");
            event.preventDefault();
            return;
        }        
        if(email.value == ""){
            alert("Email không được để trống");
            event.preventDefault();
            return;
        }
    }

    cancelBtn.onclick = () => {
        event.preventDefault();
        paymentPopup.style.top = "-150%";
        body.style.overflowY = "scroll";
    }
});