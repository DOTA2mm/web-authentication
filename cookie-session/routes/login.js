var express = require('express');
var router = express.Router();
var userModel = require('../models/users');
var utils = require('../lib/utils');
var debug = require('debug')('CS');

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
      var sessid = utils.randomWord(false, 16);
      var sessUserInfo = {
        userName: userInfo.user_name, 
        userNickname: userInfo.user_nickname
      }
      generateSession(sessid, sessUserInfo, res);
      // req.session.userInfo = userInfo;
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

/**
 * 生成 session
 * @param {String} sessid session id
 * @param {Object} userInfo 用户信息
 * @param {Response} res
 */
function generateSession (sessid, userInfo, res) {
  global.SESSION[sessid] = {
    cookie: {
      originalMaxAge: 1800000,
      expires: new Date(Date.now() + 1800000),
      httpOnly: true,
      path: '/'
    },
    userInfo: userInfo
  }
  res.cookie('connsid', sessid, {
    maxAag: 1800000,
    expires: new Date(Date.now() + 1800000),
    httpOnly: true,
    path: '/'
  });
  debug('SESSION: %O', global.SESSION)
}

module.exports = router;
