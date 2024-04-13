require('dotenv').config();
const Model = require("../Model/login.model");

var IS_USE_DYNAMIC_TOKEN = process.env.IS_USE_DYNAMIC_TOKEN;


exports.Login = async (req, res) => {
    try {
        Model.Login(req.body, (error, resData) => {
            if (error) {
                error.Token = req.body?.Token || '';
                res.status(200).send(error);
            } else {
                res.status(200).send(resData);
            }
        });
    } catch (error) {
        console.log(error);
        let resp = {
            'status': 0,
            'message': error.message,
            'data': {}
        }
        res.status(200).send(resp);
    }
}

exports.UserList = async (req, res) => {
    try {
        Model.UserList(req.body, (error, resData) => {
            if (error) {
                error.Token = req.body?.Token || '';
                res.status(200).send(error);
            } else {
                res.status(200).send(resData);
            }
        });
    } catch (error) {
        console.log(error);
        let resp = {
            'status': 0,
            'message': error.message,
            'data': {}
        }
        res.status(200).send(resp);
    }
}


exports.AddUpdateUser = async (req, res) => {
    try {
        Model.AddUpdateUser(req.body, (error, resData) => {
            if (error) {
                error.Token = req.body?.Token || '';
                res.status(200).send(error);
            } else {
                res.status(200).send(resData);
            }
        });
    } catch (error) {
        console.log(error);
        let resp = {
            'status': 0,
            'message': error.message,
            'data': {}
        }
        res.status(200).send(resp);
    }
}

exports.DeleteUser = async (req, res) => {
    try {
        Model.DeleteUser(req.body, (error, resData) => {
            if (error) {
                error.Token = req.body?.Token || '';
                res.status(200).send(error);
            } else {
                res.status(200).send(resData);
            }
        });
    } catch (error) {
        console.log(error);
        let resp = {
            'status': 0,
            'message': error.message,
            'data': {}
        }
        res.status(200).send(resp);
    }
}