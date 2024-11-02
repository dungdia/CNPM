const jwt = require("jsonwebtoken")
const promisify = require('util').promisify;

const sign = promisify(jwt.sign).bind(jwt);
const verify = promisify(jwt.verify).bind(jwt);

module.exports = class{

    static async generateToken(payload,secretSignature, tokenLife){
        try {
            return await sign(
                {
                    payload,
                },
                secretSignature,
                {
                    algorithm: 'HS256',
                    expiresIn: tokenLife,
                },
            );
        } catch (error) {
            console.log(`Error in generate access token:  + ${error}`);
            return null;
        }
    }

    static async verifyToken(token,secretSignature){
        try {
            return await verify(token,secretSignature)
        } catch (error) {
            const errorMessage = error.message
            if(errorMessage === "jwt expired")
                return {message: "token expire", expire: true}
            console.log(`Error in verify access token:  + ${error}`);
            return null;
        }
    }

    static async decodedExpireToken(token,secretSignature){
        try {
            return await verify(token,secretSignature,{
                ignoreExpiration: true,
            })
        } catch (error) {
            console.log(`Error in verify access token:  + ${error}`);
            return null;
        }
    }

}