var express = require('express');
var router = express.Router();
const ctrlUsers = require("../controllers/users");

router.post('/login', ctrlUsers.Login);

router.post('/signup', ctrlUsers.Signup);

module.exports = router;