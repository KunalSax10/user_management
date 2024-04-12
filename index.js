const express = require('express')
var router = express.Router();
const app = express()
const port = 3000
const validator = require("./validator");
const Login = require("./Controller/login.controller");


router.post('/Login', validator.ApiAuthentication, validator.Login, Login.Login);



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})