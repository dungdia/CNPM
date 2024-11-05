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
        if(!resData.success) {
            alert(resData.message)
            return
        }
            console.log(resData)
            const {access_token,refesh_token} = resData
            // console.log(access_token ,"\n",refesh_token)
            localStorage.setItem("refesh_token",refesh_token)
            localStorage.setItem("token",access_token)
            alert("Đăng nhập thành công")
            window.location = "/"

    } catch (error) {
        console.log(error)
    }
}

