const express = require('express')
var router = express.Router();
const app = express()
const port = 3000
const validator = require("./validator");
const Login = require("./Controller/login.controller");
var bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }));


app.use(express.json()); // Body parsing middleware
app.use(express.urlencoded({ extended: true }));

router.post('/Login', validator.ApiAuthentication, validator.Login, Login.Login);
router.post('/UserList', validator.ApiAuthentication, Login.UserList);

app.use('/', router);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})