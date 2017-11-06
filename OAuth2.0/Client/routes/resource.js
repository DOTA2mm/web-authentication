var express = require('express');
var router = express.Router();
var rdsStore = require('../models/rdsStore');
var request = require('request');
var debug = require('debug')('Client:resource');

router.get('/', init, getResource, function (req, res, next) {
    if (res.locals.state.errCode === 0) {
        res.render('resource');
    } else {
        res.render('auth_err');
    }
});

function init (req, res, next) {
    res.locals.state = {
        errCode: 0,
        errMsg: ''
    }
    next();
}

// 确认用户登录
function getResource (req, res, next) {
    if (req.session.userInfo) {
        // 登录用户
        next();
    } else {
        rdsStore.get('HIfhh7wGFk65H').then(reply => {
            if (reply && reply.client_id) {
                httpPost('http://localhost:3001/api/resource', {
                    clientId: reply.client_id,
                    asccessToken: reply.asccess_token
                }).then(ret => {
                    if (ret.errCode === 0) {
                        res.locals.userInfo = ret.userInfo;
                        res.locals.resources = ret.resources;
                    } else {
                        res.locals.state.errCode = -300;
                        res.locals.state.errMsg = '远程服务异常';
                    }
                })
            } else {
                res.locals.state.errCode = -200;
                res.locals.state.errMsg = '未找到 token 信息';
            }
        }, err => {
            debug('获取 token 失败. %O', err);
            res.locals.state.errCode = -400;
            res.locals.state.errMsg = '获取 token 失败';
        });
        next();
    }
}

/**
 * HTTP POST 请求 Promise 封装
 * @param {String} authUrl 接口 url 
 * @param {Object} formData 请求参数
 * @return {Promise}
 */
function httpPost(authUrl, formData) {
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
