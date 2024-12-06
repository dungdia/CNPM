import { Validation } from "./validation.js";
import CookieManager from 'https://cdn.jsdelivr.net/npm/js-cookie-manager@1.0.2/index.min.js';

const userInfoForm = document.getElementById("user-info-form-container");
const userInfoFormBody = document.getElementById("user-info-form-container").querySelectorAll("input");
const userFullname = document.getElementById("user-info-fullname");
// const userEmail = document.getElementById("user-info-email");
const userGenderMale = document.getElementById("gender-male");
const userGenderFemale = document.getElementById("gender-female");
const userPhoneNumber = document.getElementById("user-info-phone-number");
const userAddress = document.getElementById("user-info-address");

const changePasswordForm = document.getElementById("user-info-password-configure");
const changePasswordFormBody = document.getElementById("user-info-password-configure").querySelectorAll("input");
const oldPassword = document.getElementById("user-info-old-password");
const newPassword = document.getElementById("user-info-new-password");
const newConfirmPassword = document.getElementById("user-info-confirm-new-password");

async function fetchCustomerData() {
    const res = await fetch(`./api/auth/getCustomerInfo`);
    const json = await res.json();
    return json;
}

async function customerInformationRender() {
    const data = await fetchCustomerData(); // fetch thông tin tài khoản của khách hàng

    userFullname.value = data[0].ho_ten;
    if(data[0].gioi_tinh == 0)
        userGenderMale.checked = true;
    else
        userGenderFemale.checked = true;
    userPhoneNumber.value = data[0].sodienthoai;
    userAddress.value = data[0].diachi;
}
customerInformationRender();

changePasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let valid = true
    if (!Validation.checkIsEmpty(oldPassword) || !Validation.checkIsEmpty(newPassword)) {
        valid = false
    } else {
        if (!Validation.checkConfirmChangePassword(newPassword, newConfirmPassword)) {
            valid = false
        }
    }

    if (!valid) {
        return
    }

    await handleUpdateUserPassword();
})

function getLabel(e) {
    return document.querySelector(`label[for=${oldPassword.id}]`)
}

const handleUpdateUserPassword = async () => {
    var formData = new FormData(changePasswordForm);
    var data = Object.fromEntries(formData.entries());

    const cookieManager = new CookieManager();
    const access_token = cookieManager.get("access_token");

    data.access_token = access_token
    try {
        const res = await fetch(`/api/data/userPassword`, {
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
            oldPassword.classList.add("is-invalid")
            console.log(getLabel(oldPassword))
            return;
        }
        // clearValid(userInfoFormBody);
        alert("Lưu thành công")
    } catch (error) {
        console.log(error);
    }
};

userInfoForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let valid = true;
    if (!Validation.isFormBlank(userInfoFormBody)) {
        valid = false;
    }
    if (!Validation.checkPhoneNumber(userPhoneNumber)) {
        valid = false;
    }
    if(!Validation.checkFullName(userFullname)){
        valid = false;
    }

    if(!Validation.checkAddress(userAddress)){
        valid = false;
    }
    if (!valid) {
        return
    }

    await handleUpdateUserInfo();
});

const clearValid = (formBody) =>{
    for(const ele of formBody){
        ele.classList.remove("is-valid")
    }
}

const handleUpdateUserInfo = async () => {
    var formData = new FormData(userInfoForm);
    var data = Object.fromEntries(formData.entries());

    const cookieManager = new CookieManager();
    const access_token = cookieManager.get("access_token");

    data.access_token = access_token
    data.userGender = parseInt(data.userGender);
    try {
        const res = await fetch(`/api/data/userInfo`, {
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
            return;
        }
        clearValid(userInfoFormBody);
        alert("Lưu thành công")
    } catch (error) {
        console.log(error);
    }
};
