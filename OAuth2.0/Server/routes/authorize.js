var express = require('express');
var router = express.Router();
var utils = require('../lib/utils');
var clientModel = require('../models/client');
var rdsStore = require('../models/rdsStore');
var debug = require('debug')('Server:authorize');

// 允许第三方应用的跨域请求
// router.use('/', function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
//   res.setHeader('Access-Control-Allow-Methods', 'GET');
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//   next();
// });
// 请求授权页面
// http://localhost:3001/OAuth2/authorize?state=HIfhh7wGFk65H&redirect_uri=http://localhost:1002/auth/callback&response_type=code&client_id=4GU8Am5xxN
router.get('/', init, checkParam, checkLogin, function (req, res, next) {
  res.render('authorize');
});
// 确认授权
router.post('/', init, checkParam, checkLogin, generateCode);
// 拒绝授权
router.put('/');
// 验证客户端 access_token 请求
router.post('/access', init, checkAuthParam, generateToken);

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
  var clientId = req.query.client_id || req.body.client_id;
  var redirectUri = req.query.redirect_uri || req.body.redirect_uri;
  var responseType = req.query.response_type || req.body.response_type;
  var state = req.query.state || req.body.state;
  var scope = req.query.scope || req.body.scope || '';
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
      if (redirectUri && redirectUri === rows[0].c_redirecturi) {
        res.locals.state.clientInfo = rows[0];
        res.locals.state.clientInfo.state = state;
      } else {
        res.locals.state.errCode = -401;
        res.locals.state.errMsg = '错误的 redirect_uri';
      }
    } else {
      res.locals.state.errCode = -400;
      res.locals.state.errMsg = 'client_id 不存在，请验证';
    }
    next();
  }, err => {
    console.log(err);
    res.locals.state.errCode = -500;
    res.locals.state.errMsg = '认证服务内部异常';
    next();
  });
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

// 生成 authorization code
function generateCode (req, res, next) {
  var clientInfo = res.locals.state.clientInfo;
  var code = utils.randomWord(false, 20);
  clientInfo.code = code;
  rdsStore.set(clientInfo.c_id, {clientInfo: clientInfo, userInfo: req.session.userInfo}, 600).then(reply => {
    console.log(reply);
    if (reply === 'OK') {
      res.redirect(clientInfo.c_redirecturi + '?code=' + code + '&state=' + clientInfo.state);
    }
  })
}

// 验证获取 token 请求的参数
function checkAuthParam (req, res, next) {
  if (req.method === 'OPTIONS') {
    res.send(200);
    return;
  }
  var grantType = req.body.grant_type;
  var authCode = req.body.code;
  var redirectUri = req.body.redirect_uri;
  var clientId = req.body.client_id;
  if (grantType !== 'authorization_code') {
    res.locals.state.errCode = -200;
    res.locals.state.errMsg = '错误的 grant_type';
    next();
    return;
  }
  if (!clientId || !authCode || !redirectUri) {
    res.locals.state.errCode = -201;
    res.locals.state.errMsg = '参数缺失';
    next();
    return;
  }
  rdsStore.get(clientId).then(ret => {
    if (redirectUri !== ret.clientInfo.c_redirecturi) {
      res.locals.state.errCode = -300;
      res.locals.state.errMsg = '第三方应用信息有误';
    } else if (authCode !== ret.clientInfo.code) {
      res.locals.state.errCode = -310;
      res.locals.state.errMsg = 'authorization_code 有误';
    } else {
      debug('有效的 access_token 请求');
      res.locals.state.userInfo = ret.userInfo;
    }
    next();
  }, err => {
    console.log(err);
    res.locals.state.errCode = -400;
    res.locals.state.errMsg = '无效的 client_id';
    next();
  });
}

// 生成 access_token
function generateToken (req, res, next) {
  if (res.locals.state.errCode === 0) {
    var accessToken = utils.randomWord(false, 20);
    var refreshToken = utils.randomWord(false, 20);
     // 生成 token 后删除 code (一次性 authorization_code)
     Promise.all([rdsStore.del(req.body.client_id), rdsStore.set(req.body.client_id, {
      tokenInfo: {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: 36000,
        timestamp: Date.now()
      },
      userInfo: res.locals.state.userInfo
    }, 36000)]).then(([ret0, ret1]) => {
      if (ret0 === 1 && ret1 === 'OK') {
        res.setHeader('Cache-Control', 'no-store'); // 强制不缓存结果
        res.setHeader('Pragma', 'no-cache');
        res.send({
          errCode: res.locals.state.errCode,
          errMsg: res.locals.state.errMsg,
          access_token: accessToken,
          token_type: 'bearer', // token 未按 bearer token 规范生成,
          expires_in: 36000,
          refresh_token: refreshToken
        });
      } else {
        res.locals.state.errCode = -500;
        res.locals.state.errMsg = 'Generate access token failed.';
        res.send(res.locals.state);
      }
    }).catch((err) => {
      console.log(err);
      res.locals.state.errCode = -510;
      res.locals.state.errMsg = 'Generate access token has exception.';
      res.send(res.locals.state);
    })
  } else {
    res.send(res.locals.state);
  }
}

module.exports = router;
