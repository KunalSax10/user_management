const express = require('express')
var router = express.Router();
const app = express()
const cors = require('cors');
const port = 3000
const validator = require("./validator");
const Login = require("./Controller/login.controller");
var multer = require('multer')
var bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }));


app.use(express.json()); // Body parsing middleware

app.use(cors({ origin: true }));
app.use(express.urlencoded({ extended: false }));



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Destination folder for uploaded files
    },
    filename: function (req, file, cb) {
        // File name will be original name with timestamp
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize Multer with the configured storage
const upload = multer({ storage: storage });

router.post('/Login', validator.ApiAuthentication, validator.Login, Login.Login);
router.post('/UserList', validator.ApiAuthentication, validator.UserList, Login.UserList);
router.post('/AddUpdateUser', validator.ApiAuthentication, validator.AddUpdateUser, Login.AddUpdateUser);
router.post('/DeleteUser', validator.ApiAuthentication, validator.DeleteUser, Login.DeleteUser);

app.use('/', router);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})