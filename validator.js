require('dotenv').config();
const { check, validationResult, body } = require('express-validator');
const _ = require('lodash');
const Library = require('./helper/Library');

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
    async (req, res, next) => {
        console.log(req.files);
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

        let ServiceName = req.url.replace('/', '');
        req.body.ServiceName = ServiceName.toString();

        var Ip_Address_Dynamic = await Library.GetIpAddress(req);
        req.body.Ip_Address_Dynamic = Ip_Address_Dynamic;
        if (!allowedDefaultService.includes(ServiceName)) {
            if (!req.body.Token || !parseInt(req.body.UserId)) {
                return res.status(200).send(response);
            }

            let verificationResult = await Library.verify_Token(req.body.Token);

            if (verificationResult.data.data.UserId != req.body.UserId) {
                response = {
                    'status': '2',
                    'message': 'Session Expire',
                    'data': {},
                }
                return res.status(200).send(response);
            }

            if (verificationResult.success) {
                return next();
            }
            else {
                response = {
                    'status': '2',
                    'message': 'Session Expire',
                    'data': {},
                }
                return res.status(200).send(response);
            }
        } else {
            return next();
        }
        return res.status(200).send(response);
    },
]



exports.Login = [
    check('Email', 'Email is required').trim().notEmpty(),
    check('Password', 'Password is required').trim().notEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            var error_string = InvalidParameter(errors.array());
            var response = {
                "status": "0",
                "message": error_string,
                "data": {}
            };
            console.log(req.body);
            return res.status(200).send(response);
        }
        next();
    },
]


exports.UserList = [
    check('UserId', 'UserId is required').trim().notEmpty(),
    check('Role', 'Role id is required').trim().notEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            var error_string = InvalidParameter(errors.array());
            var response = {
                "status": "0",
                "message": error_string,
                "data": {}
            };
            console.log(req.body);
            return res.status(200).send(response);
        }
        next();
    },
]

exports.AddUpdateUser = [
    check('UserId', 'UserId is required').trim().notEmpty(),
    check('Role', 'Role id is required').trim().notEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            var error_string = InvalidParameter(errors.array());
            var response = {
                "status": "0",
                "message": error_string,
                "data": {}
            };
            console.log(req.body);
            return res.status(200).send(response);
        }
        next();
    },
]

exports.DeleteUser = [
    check('UserId', 'UserId is required').trim().notEmpty(),
    check('Role', 'Role is required').trim().notEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            var error_string = InvalidParameter(errors.array());
            var response = {
                "status": "0",
                "message": error_string,
                "data": {}
            };
            console.log(req.body);
            return res.status(200).send(response);
        }
        next();
    },
]