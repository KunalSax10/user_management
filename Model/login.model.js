require('dotenv').config();
const sqlhelper = require("../helper/sqlhelper");
const moment = require('moment');
var md5 = require('md5');
const _ = require('lodash');
const Library = require('../helper/Library');
const Model = {};



Model.Login = async (request, files, callback) => {
    var response = {
        "status": "0",
        "message": "Something is wrong."
    };

    try {
        const UserName = request.Email;
        const Password = request.Password;

        let query = `SELECT UserId, FullName, Email, Mobile, Role FROM mst_userlist WHERE (Mobile=? OR Email=?) AND Password=? AND Status = 1`;
        const Data = await sqlhelper.fetchData(query, [UserName, UserName, Password]);

        if (Data.length == 0) {
            throw new Error('Invalid username and password');
        } else {
            var TokenData = Library.generate_Token(Data[0]);
            if (TokenData.status == "1") {
                response["Token"] = TokenData.accessToken;
                let loginPhoto;
                if (files && files['LoginPhoto']) {
                    loginPhoto = files['LoginPhoto'] ? files['LoginPhoto'][0].path : '';
                }
                await Library.LoginHistoryStore(Data[0], 1, loginPhoto);
            } else {
                throw new Error("Something went wrong. Please try again.");
            }
        }

        response.message = 'success';
        response.status = '1';
        response.data = Data[0];

        console.log("Login response:", response);

        callback(null, response);
    } catch (error) {
        console.error("error:", error);
        const errorResponse = {
            "status": "0",
            "message": error.message
        };
        console.error("Error response:", errorResponse);
        return callback(errorResponse, null);
    }
};



Model.UserList = async (request, callback) => {
    var response = {
        "status": "0",
        "message": "Something is wrong."
    };
    try {
        let query = `select UserId,FullName,FirstName,LastName,Email,Mobile,Role,Address,Gender,Password
        from mst_userlist`;
        const Data = await sqlhelper.fetchData(query, []);

        response.message = 'success';
        response.status = '1';
        response.List = Data;

        callback(null, response);
    } catch (error) {
        console.error("error =====> ", error);
        const errorResponse = {
            "status": "0",
            "message": error.message
        };
        return callback(errorResponse, null);
    }
};

Model.AddUpdateUser = async (request, callback) => {
    var response = {
        "status": "0",
        "message": "Something is wrong."
    };
    const requestData = request;
    try {
        const UpdateUserId = request.UpdateUserId;
        const Ip_Address_Dynamic = request.Ip_Address_Dynamic;
        const UserId = request.UserId;
        const userData = {
            UserId: UpdateUserId,
            FirstName: requestData.FirstName || '',
            LastName: requestData.LastName || '',
            Role: requestData.Role || 'user',
            Address: requestData.Address || '',
            Mobile: requestData.Mobile || '',
            Email: requestData.Email || '',
            Password: requestData.Password || '',
            Gender: requestData.Gender || 'Male',
            EntryDate: new Date(),
            EntryBy: UserId || 'Admin',
            EntryIp: Ip_Address_Dynamic,
            Status: 1
        };
        if (UpdateUserId) {
            const updateResult = await sqlhelper.updateData('mst_userlist', userData, { UserId: UpdateUserId });
            if (updateResult) {
                response.message = 'User updated successfully';
                response.status = '1';
                response.user = userData;
            } else {
                response.message = 'Failed to update user';
            }
        } else {
            const insertResult = await sqlhelper.insertData('mst_userlist', userData);
            if (insertResult) {
                response.message = 'User added successfully';
                response.status = '1';
                response.data = userData;
            } else {
                response.message = 'Failed to add user';
            }
        }

        callback(null, response);
    } catch (error) {
        console.error("error =====> ", error);
        const errorResponse = {
            "status": "0",
            "message": error.message
        };
        return callback(errorResponse, null);
    }
};

Model.DeleteUser = async (request, callback) => {
    var response = {
        "status": "0",
        "message": "Something is wrong."
    };
    try {
        const UserId = request.UserId;
        const where = {
            'UserId': UserId,
        }
        await sqlhelper.delete('mst_userlist', where);
        response.message = 'User deleted successfully';
        response.status = '1';

        callback(null, response);
    } catch (error) {
        console.error("error =====> ", error);
        const errorResponse = {
            "status": "0",
            "message": error.message
        };
        return callback(errorResponse, null);
    }
};



module.exports = Model;
