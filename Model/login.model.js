require('dotenv').config();
const sqlhelper = require("../helper/sqlhelper");
const moment = require('moment');
var md5 = require('md5');
const _ = require('lodash');
const Library = require('../helper/Library');
const Model = {};



Model.Login = async (request, callback) => {
    var response = {
        "status": "0",
        "message": "Something is wrong."
    };

    try {
        const UserName = request.UserName;
        const Password = request.Password;

        let query = `select UserId,FullName,Email,Mobile,Role
        from mst_userlist where (Mobile=? OR Email=?) AND Password=? AND Status =1`;
        const Data = await sqlhelper.fetchData(query, [UserName, UserName, Password]);

        if (Data.length == 0) {
            throw new Error('Invalid username and password');
        } else {
            var TokenData = Library.generate_Token(Data[0]);
            if (TokenData.status == "1") {
                response["Token"] = TokenData.accessToken;
            }
            else {
                throw new Error("Somthing went wrong. Please try again.");
            }
        }

        response.message = 'success';
        response.status = '1';
        response.Data = Data[0];

        callback(null, response);
    } catch (error) {
        console.error("error =====> ", error);
        // Handle the error appropriately, e.g., return an error response to the callback
        const errorResponse = {
            "status": "0",
            "message": error.message
        };
        return callback(errorResponse, null);
    }
};

Model.UserList = async (request, callback) => {
    var response = {
        "status": "0",
        "message": "Something is wrong."
    };

    try {
        let query = `select UserId,FullName,Email,Mobile,Role
        from mst_userlist`;
        const Data = await sqlhelper.fetchData(query, []);

        response.message = 'success';
        response.status = '1';
        response.List = Data;

        callback(null, response);
    } catch (error) {
        console.error("error =====> ", error);
        // Handle the error appropriately, e.g., return an error response to the callback
        const errorResponse = {
            "status": "0",
            "message": error.message
        };
        return callback(errorResponse, null);
    }
};


module.exports = Model;