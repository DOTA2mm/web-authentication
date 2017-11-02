var express = require('express');
var router = express.Router();
var utils = require('../lib/utils');
var clientModel = require('../models/client');
var rdsStore = require('../models/rdsStore');

router.get('/', init, checkParam, checkLogin, function (req, res, next) {
  res.render('authorize');
});

// 初始化错误类型
function init (req, res, next) {
  res.locals.state = {
    errCode: 0,
    errMsg: ''
  }
  next();
}

// 确认请求参数是否合法
function checkParam (req, res, next) {
  var clientId = req.query.client_id;
  var redirectUri = req.query.redirect_uri;
  var responseType = req.query.response_type;
  var state = req.query.state;
  if (!clientId) {
    res.locals.state.errCode = -100;
    res.locals.state.errMsg = '缺少参数 client_id';
    next();
    return;
  }
  if (responseType.toLowerCase() !== 'code') {
    res.locals.state.errCode = -100;
    res.locals.state.errMsg = '暂仅提供授权码模式的认证';
    next();
    return;
  }
  clientModel.queryClientInfoById(clientId).then(rows => {
    if (rows.length > 0) {
      if (redirectUri && redirectUri === rows[0].redirect_uri) {
        res.locals.state.clientInfo = rows[0];
      } else {
        res.locals.state.errCode = -401;
        res.locals.state.errMsg = '错误的 redirect_uri';
        next();
      }
    } else {
      res.locals.state.errCode = -400;
      res.locals.state.errMsg = 'client_id 不存在，请验证';
      next();
    }
  }, err => {
    console.log(err);
    res.locals.state.errCode = -500;
    res.locals.state.errMsg = '认证服务内部异常';
    next();
  });
}

// 生成 authorization code
function generateCode (req, res, next) {
  var clientId = req.query.client_id;
  var code = utils.randomWord(false, 20);
  rdsStore.set(clientId, {code: code})
}

// 确认 ResourceOwner 是否登录
function checkLogin (req, res, next) {
  if (res.locals.state.errCode !== 0) {
    res.render('auth_err');
  } else {
    if (req.session.userInfo) {
      res.locals.userInfo = req.session.userInfo;
      next();
    } else {
      res.render('login');
    }
  }
}

module.exports = router;
