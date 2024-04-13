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
    /* below code comment because send encrypted request */
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

        let ServiceName = req.url.replace('/', '');
        req.body.ServiceName = ServiceName.toString();
        console.log(!allowedDefaultService.includes(ServiceName), req.body);
        if (!allowedDefaultService.includes(ServiceName)) {
            if (!req.body.Token || !parseInt(req.body.UserId)) {
                return res.status(200).send(response);
            }

            let verificationResult = await Library.verify_Token(req.body.Token); // jwt token varify
            console.log(verificationResult.data.data);
            if (verificationResult.data.data.UserId != req.body.UserId) {
                response = {
                    'status': '2',
                    'message': 'Session Expire',
                    'data': {},
                }
                return res.status(200).send(response); // Authentication Fail
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
                return res.status(200).send(response); // Authentication Fail
            }
        } else {
            return next();
        }

        /* Encrypt request convert into Decrypt - END */
        return res.status(200).send(response); // Authentication Fail
    },
]



exports.Login = [
    check('UserName', 'UserName id is required').trim().notEmpty(),
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