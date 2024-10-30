export class Validate{
    static isNumber(n){
        const regex = /^[0-9]*$/g
        return regex.test(n)
    }
}