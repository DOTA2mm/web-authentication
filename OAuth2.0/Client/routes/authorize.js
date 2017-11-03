var express = require('express');
var router = express.Router();
var utils = require('../lib/utils');
var clientModel = require('../models/client');
var rdsStore = require('../models/rdsStore');
var request = require('request');
var debug = require('debug')('OAuth:Client');

// 换取 access_token
// http://localhost:3001/OAuth2/authorize?state=HIfhh7wGFk65H&redirect_uri=http://localhost:1002/auth/callback&response_type=code&client_id=4GU8Am5xxN
router.get('/', init, checkParam, getAccessToken, function (req, res, next) {
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
  var error = req.query.error;
  var code = req.query.code;
  var state = req.query.state;
  if (!code && !error) {
    res.locals.state.errCode = -100;
    res.locals.state.errMsg = '缺少参数 authorization_code 或 error';
  }
  next();
}

// 请求 AS 获取 access_token
function getAccessToken (req, res, next) {
  if (res.locals.state.errCode === 0) {
    httpPost('http://localhost:4000/OAuth2/authorize/').then(ret => {
  
    }, err => {
      console.log(err);
      res.locals.state.errCode = -100;
      res.locals.state.errMsg = '换取 access_token 发生异常';
      next();
    });
  }
  next();
}

/**
 * HTTP POST 请求 Promise 封装
 * @param {String} authUrl 接口 url 
 * @param {Object} formData 请求参数
 * @return {Promise}
 */
function httpPost (authUrl, formData) {
  request.post(authUrl, {formData: formData}, (error, response, body) => {
    var ret = null;
    if (error) {
      debug('httpPost | Request failed.', authUrl, formData, error);
      return Promise.reject(error);
    } else {
        try {
            ret = JSON.parse(body);
        } catch (err) {
            debug('httpPost | Request failed.', ret, err);
            return Promise.reject(err);
        }
        return Promise.resolve(ret);
    }
  });
}

module.exports = router;
