var express = require('express');
var router = express.Router();
var utils = require('../lib/utils');
var rdsStore = require('../models/rdsStore');
var request = require('request');
var debug = require('debug')('Client:authorize');

// 第三方服务提供商 key: 提供给 AS 的 state
const athorizeServersMap = {
  'HIfhh7wGFk65H': {
    redirect_uri: 'http://localhost:1002/auth/callback', // 提供给 AS 的重定向 uil
    client_id: '4GU8Am5xxN' // AS 提供的本应用 id
  }
}

// 允许 AS 重定向的跨域请求
router.use('/', function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next();
});
// 换取 access_token
router.get('/callback', init, checkParam, getAccessToken, function (req, res, next) {
  if (res.locals.state.errCode === 0) {
    res.redirect('/resource');
  } else {
    res.render('auth_err');
  }
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
  if (req.method === 'OPTIONS') {
    res.send(200);
    return;
  }
  var error = req.query.error;
  var code = req.query.code;
  var state = req.query.state;
  var uid = req.query.uid;
  if (!code && !error) {
    res.locals.state.errCode = -100;
    res.locals.state.errMsg = '缺少参数 authorization_code 或 error';
  } else if (error) {
    res.locals.state.errCode = -400;
    res.locals.state.errMsg = '您已拒绝授权';
  } else {
    res.locals.state.uid = uid;
    res.locals.state.code = code;
    res.locals.state.state = state;
  }
  next();
}

// 请求 AS 获取 access_token
function getAccessToken (req, res, next) {
  if (res.locals.state.errCode === 0) {
    var params = {
      grant_type: 'authorization_code',
      code: res.locals.state.code,
      redirect_uri: athorizeServersMap[res.locals.state.state].redirect_uri,
      client_id: athorizeServersMap[res.locals.state.state].client_id
    }
    httpPost('http://localhost:3001/OAuth2/authorize/access', params).then(ret => {
      if (ret.errCode === 0) {
        debug('getAccessToken | Get access_token successful. | %O', ret);
        rdsStore.set(req.query.state, {
          client_id: params.client_id,
          access_token: ret.access_token,
          refresh_token: ret.refresh_token,
          expires_in: ret.expires_in
        }, ret.expires_in).then(reply => {
          if (reply !== 'OK') {
            res.locals.state.errCode = -510;
            res.locals.state.errMsg = 'token 存储失败';
          }
        });
      } else {
        res.locals.state.errCode = ret.errCode;
        res.locals.state.errMsg = ret.errMsg;
      }
      next();
    }, err => {
      console.log(err);
      res.locals.state.errCode = -500;
      res.locals.state.errMsg = '换取 access_token 发生异常';
      next();
    });
  } else {
    next();
  }
}

// 获取 RS 上的资源

/**
 * HTTP POST 请求 Promise 封装
 * @param {String} authUrl 接口 url 
 * @param {Object} formData 请求参数
 * @return {Promise}
 */
function httpPost (authUrl, formData) {
  return new Promise((resolve, reject) => {
    request.post(authUrl, {form: formData}, (error, response, body) => {
      var ret = null;
      if (error) {
        debug('httpPost | Request failed.', authUrl, formData, error);
        reject(error);
      } else {
          try {
              ret = JSON.parse(body);
          } catch (err) {
              debug('httpPost | Request failed.', ret, err);
              reject(err);
          }
          resolve(ret);
      }
    });
  });
}

module.exports = router;
