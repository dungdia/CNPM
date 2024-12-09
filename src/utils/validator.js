module.exports = class Validator {
    static isEmpty(value) {
        return value === null || value === undefined || value === "";
    }

    // tối thiểu 1-255 ký tự và không có khoảng trắng ở đầu hoặc cuối
    static regexText(text) {
        return /^[^\s]{0,255}[^\s]$/.test(text);
    }

    static isNumber(num) {
        return /^(0*([1-9]\d*|0*\.\d*[1-9]\d*))$/.test(num);
    }

    static imageExtension(image) {
        return /\.(jpg|jpeg|png|gif)$/.test(image);
    }

    static regexUsername(username) {
        return /^(?! ).*/.test(username)
    }

    // tối thiểu 8 ký tự và không có khoảng trắng
    static regexPassword(password) {
        return /^(?! )[^\s ]{8,}$/.test(password);
    }

    static checkPassword(setPassword, confirmPassword) {
        return setPassword === confirmPassword;
    }

    static isPhoneNumber(phoneNumber) {
        return /^((03|05|07|08|09)[0-9]{8})$/.test(phoneNumber);
    }
}