import { Validation } from './validation.js'

const signupEvent = document.getElementById("register-button__sign-up")
const signupFormBody = document.getElementById("register-form__body").querySelectorAll("input")
const signupInputUsername = document.getElementById("register-form__input--username")
const signupInputEmail = document.getElementById("register-form__input--email")
const signupInputPassword = document.getElementById("register-form__input--password")
const signupInputConfirmPassword = document.getElementById("register-form__input--confirm-password")

signupEvent.addEventListener('click', () => {
    console.log(Validation.isFormBlank(signupFormBody))
    console.log(Validation.regexEmail(signupInputEmail))
    console.log(Validation.checkConfirmPassword(signupInputPassword, signupInputConfirmPassword))
})  