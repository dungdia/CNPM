import { Validation } from './validation.js'

const formRegister = document.getElementById("register-form__body")
const signupEvent = document.getElementById("register-button__sign-up")
const signupFormBody = document.getElementById("register-form__body").querySelectorAll("input")
const signupInputUsername = document.getElementById("register-form__input--username")
const signupInputPassword = document.getElementById("register-form__input--password")
const signupInputConfirmPassword = document.getElementById("register-form__input--confirm-password")

formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (
        Validation.isFormBlank(signupFormBody) &&
        Validation.checkPassword(signupInputPassword, signupInputConfirmPassword) &&
        Validation.checkConfirmPassword(signupInputPassword, signupInputConfirmPassword)
    ) {
        await registerData();
    }
})

let registerData = async () => {
    var formData = new FormData(formRegister);
    var data = Object.fromEntries(formData.entries());
    console.log(data)
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
        if(!resData.success){
            alert(resData.message)
            return
        }
        alert(resData.message)
        window.location = "/login"

    } catch (error) {
        console.log(error)
    }
}