export class Validate{
    static isNumber(n){
        const regex = /^[0-9]*$/g
        return regex.test(n)
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
    const addressRegex = /^[^\s][a-zA-ZÀ-ỹà-ỹ0-9\s]{1,98}[^\s]$/;
    const addressErrorDiv = document.getElementById("userAddress");
    if(!addressRegex.test(address.value)) {
      console.log("check full name")
      address.classList.add("is-invalid");
      addressErrorDiv.innerHTML = "Địa chỉ phải từ 3 - 100 kí tự, không bắt đầu bằng khoảng trắng và không chứa kí tự đặc biệt";
      return false;
    }
    return true;
  }
}