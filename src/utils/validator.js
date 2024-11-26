module.exports = class Validator {
    static isEmpty(value) {
        return value === null || value === undefined || value === "";
    }

    static regexUsername(username) {
        return /^(?! ).*/.test(username)
    }

    static regexPassword(password) {
        return /^(?! )[^\s ]{6,}$/.test(password);
    }

    static checkPassword(setPassword, confirmPassword) {
        return setPassword === confirmPassword;
    }

    static isPhoneNumber(phoneNumber) {
        const regex = /^((03|05|07|08|09)[0-9]{8})$/;

        return regex.test(phoneNumber);
    }
}