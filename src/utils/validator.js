module.exports = class Validator {
    static isEmpty(value) {
        return value === null || value === undefined || value === "";
    }

    static checkConfirmPassword(setPassword, confirmPassword){
        return setPassword === confirmPassword;
    }
}