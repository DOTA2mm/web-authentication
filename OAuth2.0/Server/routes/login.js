var express = require('express');
var router = express.Router();
var userModel = require('../models/users');

router.get('/', function (req, res, next) {
  res.render('login', {title: 'Login'});
});
router.post('/', init, login);

function init (req, res, next) {
  res.locals.state = {
    errCode: 0,
    errMsg: ''
  }
  next();
}

function login (req, res, next) {
  console.log(req.body)
  var userName = req.body.username;
  var passWord = req.body.password;
  userModel.queryUser(userName, passWord).then(rows => {
    if (rows) {
      res.send(rows);
    }
  }, err => {
    console.log(err);
  });
}

module.exports = router;
