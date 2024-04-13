require('dotenv').config();
const jwt = require('jsonwebtoken');
var Library = {};


Library.generate_Token = (data, _tokenExpireIn) => {
    var response = {};
    try {
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        const tokenExpireIn = _tokenExpireIn || process.env.TOKEN_EXPIRE_IN;
        const _data = { "data": data };
        const accessToken = jwt.sign(_data, jwtSecretKey, { expiresIn: tokenExpireIn }); // 1h //1m // 1s //365d

        response["status"] = "1";
        response["accessToken"] = accessToken;
        console.log("accessToken-----------", accessToken);
    }
    catch (error) {
        console.log(error);
        response["status"] = "0";
    }
    return response;
}

Library.verify_Token = async (token) => {
    let result = { success: false, data: null, error: null };

    try {
        if (!token || typeof token !== 'string') {
            throw new Error('Invalid token format');
        }

        // console.log("Received token:", token);

        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const decoded = await jwt.verify(token, jwtSecretKey);

        // console.log("Verification successful", decoded);
        result.success = true;
        result.data = decoded;
    } catch (error) {
        console.error("Token verification failed:", error);
        result.error = "Token verification failed";
    }

    return result;
}


module.exports = Library;