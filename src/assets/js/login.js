import { Validation } from './validation.js'

const signinEvent = document.getElementById("login-button__sign-in")
const singinInputBody = document.getElementById("login-form__body").querySelectorAll("input")
const signinInputUsername = document.getElementById("login-form__input--username")
const singinInputPassword = document.getElementById("login-form__input--password")

signinEvent.addEventListener('click', () => {
    console.log(Validation.isFormBlank(singinInputBody))
})


