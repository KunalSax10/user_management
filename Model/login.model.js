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
        const UserName = request.Email;
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
                throw new Error("Something went wrong. Please try again.");
            }
        }

        response.message = 'success';
        response.status = '1';
        response.data = Data[0];

        console.log("Login response:", response); // Add this log to verify the response

        callback(null, response); // Ensure that the callback is invoked with the response object
    } catch (error) {
        console.error("error:", error);
        // Handle the error appropriately, e.g., return an error response to the callback
        const errorResponse = {
            "status": "0",
            "message": error.message
        };
        console.error("Error response:", errorResponse); // Log the error response
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
        // Handle the error appropriately, e.g., return an error response to the callback
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
    const requestData = request.Request;
    try {
        const userData = {
            UserId:requestData.UserId || 0,
            FirstName: requestData.FirstName || '',
            LastName: requestData.LastName || '',
            Role: requestData.Role || 'user',
            Address: requestData.Address || '',
            Mobile: requestData.Mobile || '',
            Email: requestData.Email || '',
            Password: requestData.Password || '',
            Gender: requestData.Gender || 'Male',
            EntryDate: new Date(),
            EntryBy: requestData.EntryBy || 'Admin', 
            EntryIp: requestData.EntryIp || '127.0.0.1' 
        };
        if (requestData.UserId != 0) {
            const updateResult = await sqlhelper.updateData('mst_userlist', userData, { UserId: request.UserId });
            if (updateResult) {
                response.message = 'User updated successfully';
                response.status = '1';
                response.user = userData; // Include the updated user data in the response
            } else {
                response.message = 'Failed to update user';
            }
        } else {
            // Insert the user into the database
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
        // Handle the error appropriately, e.g., return an error response to the callback
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
        const  UserId  = request;
        const deleteResult = await sqlhelper.delete('mst_userlist', { UserId });

        if (deleteResult.affectedRows > 0) {
            response.message = 'User deleted successfully';
            response.status = '1';
        } else {
            response.message = 'User with the provided UserId does not exist';
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

module.exports = Model;
