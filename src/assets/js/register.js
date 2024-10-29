import { Validation } from './validation.js'

const formRegister = document.getElementById("register-form__body")
const signupEvent = document.getElementById("register-button__sign-up")
const signupFormBody = document.getElementById("register-form__body").querySelectorAll("input")
const signupInputUsername = document.getElementById("register-form__input--username")
const signupInputPassword = document.getElementById("register-form__input--password")
const signupInputConfirmPassword = document.getElementById("register-form__input--confirm-password")

formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();

    let valid = true;
    if (Validation.isFormBlank(signupFormBody) &&
        Validation.checkConfirmPassword(signupInputPassword, signupInputConfirmPassword)) {
        await registerData();
    }
})

let registerData = async () => {
    var formData = new FormData(formRegister);
    var data = Object.fromEntries(formData.entries());
    try {
        const res = await fetch(`/api/data/register`, {
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
        if (resData.message === "1") {
            alert("Đăng ký thành công")
            // thành công thì chuyển sang login form
            window.location.href = "/login"
        }
        else if (resData.message === "0") {
            alert("Tên tài khoản đã tồn tại")
        }
        else {
            alert("Đăng ký thất bại")
        }
    } catch (error) {
        console.log(error)
    }
}