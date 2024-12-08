// import { Validator } from "../../utils/validator.js";

export class Validation {
  constructor() { }
  //=======================================================================
  // isEmpty
  //=======================================================================
  static isEmpty(value) {
    return value === null || value === undefined || value === "";
  }
  //=======================================================================
  // isFormBlank
  //=======================================================================
  static isFormBlank(element) {
    console.log("-> Check form is not empty...");

    let valid = true;
    element.forEach((element) => {
      const idOfElement = document.getElementById(element.id);
      if (Validation.isEmpty(idOfElement.value)) {
        element.classList.add("is-invalid");
        valid = false;
      } else {
        element.classList.remove("is-invalid");
        element.classList.add("is-valid");
      }
    });

    return valid;
  }
  // 
  // 
  // 
  static checkIsEmpty(e) {
    console.log("-> Check form is not empty...");

    let valid = true;
    if (Validation.isEmpty(e.value)) {
      e.classList.add("is-invalid")
      valid = false
    } else {
      e.classList.remove("is-invalid")
      e.classList.add("is-valid")
    }

    return valid
  }
  //=======================================================================
  static isPassword(password) {
    const regexPassword = (/^(?! )[^\s ]{6,}$/);
    return regexPassword.test(password);
  }
  //=======================================================================
  // regexEmail
  //=======================================================================
  static regexEmail(email) {
    console.log("-> Check email...");
    let valid = true;
    const regex = /^[a-zA-z0-9._]+@[a-zA-Z0-9._]+\.[a-zA-Z]{2,}$/;
    const emailFeedback = email.parentElement.querySelector("#userEmail-feedback");
    if (!regex.test(email.value) && !Validation.isEmpty(email.value)) {
      email.classList.add("is-invalid");
      emailFeedback.innerHTML = `Email không hợp lệ`;
      return (valid = false);
    }
    return valid;
  }
  //=======================================================================
  // regexUsername
  //=======================================================================
  static checkUsername(username) {
    console.log(`-> Check regex of username... `);

    let valid = true
    const regexUsername = /^(?! ).*/
    const usernameFeedback = username.parentElement.querySelector(
      "#username-feedback"
    );
    if (!regexUsername.test(username.value)) {
      username.classList.add("is-invalid");
      usernameFeedback.innerHTML = `Username is invalid`;
      return (valid = false);
    }
    return valid;
  }
  //=======================================================================
  // checkPassword
  //=======================================================================
  static checkPassword(setPassword, confirmPassword) {
    console.log(`-> Check regex of password... `);

    let valid = true;
    const regexPassword = /^(?! )[^\s ]{6,}$/
    const passwordFeedback = setPassword.parentElement.querySelector(
      "#password-feedback"
    );

    if (!regexPassword.test(setPassword.value)) {
      setPassword.classList.add("is-invalid");
      passwordFeedback.innerHTML = `Password is invalid`;
      confirmPassword.value = ""
      confirmPassword.classList.remove("is-valid")
      return (valid = false);
    }
    return valid;
  }
  //=======================================================================
  // checkConfirmPassword
  //=======================================================================
  static checkConfirmPassword(setPassword, confirmPassword) {
    console.log(`-> Check regex of password... `);

    let valid = true;
    const regexPassword = /^(?! )[^\s ]{6,}$/
    const passwordFeedback = setPassword.parentElement.querySelector(
      "#password-feedback"
    );

    if (!regexPassword.test(setPassword.value)) {
      setPassword.classList.add("is-invalid");
      passwordFeedback.innerHTML = `Password is invalid`;
      confirmPassword.value = ""
      confirmPassword.classList.remove("is-valid")
      return (valid = false);
    }
    return valid;
  }
  // =======================================================================
  // checkPhoneNumber
  //=======================================================================
  static isPhoneNumber(phoneNumber) {
    const regex = /^0\d{9,10}$/;

    return regex.test(phoneNumber);
  }
  static checkPhoneNumber(phoneNumber) {
    console.log(`-> Check regex of phone number... `)
    let valid = true;

    const userPhoneNumberFeedback = phoneNumber.parentElement.querySelector(
      "#userPhoneNumber-feedback"
    );

    if (Validation.isEmpty(phoneNumber.value)) {
      phoneNumber.classList.add("is-invalid");
      userPhoneNumberFeedback.innerHTML = `Số điện thoại bao gồm từ 10 - 11 số và bắt đầu bằng số 0`;
      (valid = false);
    }
    if (!Validation.isPhoneNumber(phoneNumber.value)) {
      phoneNumber.classList.add("is-invalid");
      (valid = false);
    }

    return valid
  }
  //=======================================================================
  // checkConfirmPassword
  //=======================================================================
  static checkConfirmChangePassword(setPassword, confirmPassword) {
    console.log("-> Check password is match...");
    let valid = true;
    const newPasswordFeedback = document.querySelector(`label[for=${setPassword.id}]`);
    const newConfirmPasswordFeedback = document.querySelector(`label[for=${confirmPassword.id}]`);
    if (!Validation.isPassword(setPassword.value)) {
      setPassword.classList.add("is-invalid");
      newPasswordFeedback.innerHTML = `Vui lòng nhập mật khẩu hợp lệ.`;
      (valid = false);
    } else {
      if (setPassword.value !== confirmPassword.value) {
        confirmPassword.classList.add("is-invalid");
        confirmPassword.value = "";
        newConfirmPasswordFeedback.innerHTML = `Mật khẩu không khớp`;
        (valid = false);
      } else {
        confirmPassword.classList.remove("is-invalid");
        confirmPassword.classList.add("is-valid");
      }
    }

    return valid;
  }

  //=======================================================================
  // check if user's Fullname is valid or not
  //=======================================================================
  static checkFullName(fullname) {
    const fullnameRegex = /^[^\s][a-zA-ZÀ-ỹà-ỹ\s]{2,99}$/;
    const fullnameErrorDiv = document.getElementById("userFullname-feedback")
    if(!fullnameRegex.test(fullname.value)) {
      console.log("check full name")
      fullname.classList.add("is-invalid");
      fullnameErrorDiv.innerHTML = "Họ tên phải từ 3 - 100 kí tự, không bắt đầu bằng khoảng trắng và không chứa kí tự đặc biệt";
      return false;
    }
    return true;
  }
  //=======================================================================
  // check if user's address is valid or not
  //=======================================================================
  static checkAddress(address) {
    const addressRegex = /^[^\s][a-zA-ZÀ-ỹà-ỹ0-9\s]{8,99}[^\s]$/;
    const addressErrorDiv = document.getElementById("userAddress");
    if(!addressRegex.test(address.value)) {
      console.log("check full name")
      address.classList.add("is-invalid");
      addressErrorDiv.innerHTML = "Địa chỉ phải từ 10 - 100 kí tự, không bắt đầu bằng khoảng trắng và không chứa kí tự đặc biệt";
      return false;
    }
    return true;
  }
}
