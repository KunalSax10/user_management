require('dotenv').config();
const { check, validationResult, body } = require('express-validator');
const _ = require('lodash');

const API_VERSION = "1.0";

const InvalidParameter = function (errors) {
    var returnStr = "";
    errors.forEach(element => {
        // returnStr = returnStr == "" ? element.param + ": " + element.msg : returnStr + ", " + element.param + ": " + element.msg;
        returnStr = returnStr == "" ? element.msg : returnStr + ", " + element.msg;
    });
    return returnStr;
}

exports.ApiAuthentication = [
    /* below code comment because send encrypted request */
    check('Request', 'Request data is required').trim().notEmpty(),

    async (req, res, next) => {

        /* Validation - START */
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            response = {
                "status": "0",
                "message": "Require parameter missing",
                "data": {}
            };
            return res.status(200).send(Library.ResponseFormat(req.body, response));
        }
        /* Validation - END */

        /* Default response store - START */
        let allowedDefaultService = ['Login'];
        var response = {
            'status': '2',
            'message': 'Authentication Fail',
            'data': {},
        };


        /* Encrypt request convert into Decrypt - END */
        return res.status(200).send(await Library.EncryptDecryptResponse(req.body, response)); // Authentication Fail
    },
]



exports.Login = [
    check('Token', 'Token is required').trim().notEmpty(),
    check('EmployeeEmailId', 'Employee email id is required').trim().notEmpty(),
    check('EmployeePassword', 'Employee password is required').trim().notEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            var error_string = InvalidParameter(errors.array());
            var response = {
                "status": "0",
                "message": error_string,
                "data": {}
            };
            return res.status(200).send(Library.ResponseFormat(req.body, response));
        }
        next();
    },
]