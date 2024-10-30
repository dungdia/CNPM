import { Validation } from './validation.js'

const loginForm = document.getElementById("login-form__body")
const singinInputBody = document.getElementById("login-form__body").querySelectorAll("input")
const signinInputUsername = document.getElementById("login-form__input--username")
const singinInputPassword = document.getElementById("login-form__input--password")

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    let valid = true;
    if (Validation.isFormBlank(singinInputBody)) {
        await loginData();
    }
})

let loginData = async () => {
    var formData = new FormData(loginForm);
    var data = Object.fromEntries(formData.entries());

    try {
        const res = await fetch(`/api/data/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (!res.ok) {
            const errorMessage = await res.text();
            throw new Error(`HTTP error! status: ${res.status} - ${errorMessage}`);
        }

        const resData = await res.json();
        if(resData.status === "0") {
            alert("Đăng nhập thành công")
            window.location.href = "/";
        }
        else if (resData.status === "1") {
            alert("Tài khoản không tồn tại")
        }
        else if (resData.status === "2") {
            alert("Sai mật khẩu")
        }
    } catch (error) {
        console.log(error)
    }
}



