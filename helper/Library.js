require('dotenv').config();
const jwt = require('jsonwebtoken');
const sqlhelper = require('./sqlhelper');
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

        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const decoded = await jwt.verify(token, jwtSecretKey);

        result.success = true;
        result.data = decoded;
    } catch (error) {
        console.error("Token verification failed:", error);
        result.error = "Token verification failed";
    }

    return result;
}

Library.GetIpAddress = (req) => {
    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    ip = ip.split(',')[0];
    ip = ip.split(':').slice(-1)[0];
    return ip;
}

Library.LoginHistoryStore = async (UserData, Status, LoginPhoto) => {
    try {
        let insertData = {
            'LoginId': UserData.UserId,
            'Status': Status,
            'LoginPhoto': LoginPhoto || ''
        }
        let s = await sqlhelper.insertData('hst_login', insertData);
        console.log(s);
    } catch (error) {
        console.log(error);
        return 0;
    }
}

module.exports = Library;