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
  //=======================================================================
  // regexEmail
  //=======================================================================
  static regexEmail(email) {
    console.log("-> Check email...");
    let valid = true;
    const regex = /^[a-zA-z0-9._]+@[a-zA-Z0-9._]+\.[a-zA-Z]{2,}$/;
    const emailFeedback = email.parentElement.querySelector("#email-feedback");
    if (!regex.test(email.value) && !Validation.isEmpty(email.value)) {
      email.classList.add("is-invalid");
      emailFeedback.innerHTML = `Email is invalid`;
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
    console.log("-> Check password is match...");
    let valid = true;
    const confirmFeedback = confirmPassword.parentElement.querySelector(
      "#confirm-password-feedback"
    );
    if (Validation.isEmpty(confirmPassword.value)) {
      confirmFeedback.innerHTML = `Please enter a password to confirm.`;
      return (valid = false);
    }
    if (setPassword.value !== confirmPassword.value) {
      confirmPassword.classList.add("is-invalid");
      confirmFeedback.innerHTML = `Password is not match`;
      return (valid = false);
    } else {
      confirmPassword.classList.add("is-valid");
    }
    return valid;
  }
}
