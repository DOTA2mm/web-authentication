var express = require('express');
var router = express.Router();
var userModel = require('../models/users');

router.get('/', function (req, res, next) {
  res.render('login');
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
  var userName = req.body.username;
  var passWord = req.body.password;
  userModel.queryUser(userName, passWord).then(rows => {
    if (rows.length > 0) {
      let userInfo = rows[0];
      req.session.userInfo = userInfo;
      res.send(res.locals.state);
    } else {
      res.locals.state.errCode = -400;
      res.locals.state.errMsg = '用户名或密码错误';
      res.send(res.locals.state);
    }
  }, err => {
    console.log(err);
    res.locals.state.errCode = -500;
    res.locals.state.errMsg = '登录失败，请重试';
    res.send(res.locals.state);
  });
}

module.exports = router;
