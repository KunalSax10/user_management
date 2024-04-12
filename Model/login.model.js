require('dotenv').config();
const sqlhelper = require("../helper/sqlhelper");
const moment = require('moment');
var md5 = require('md5');
const _ = require('lodash');
const Model = {};



Model.Login = async (request, callback) => {
    var response = {
        "status": "0",
        "message": "Something is wrong."
    };

    const date = new Date();

    try {

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