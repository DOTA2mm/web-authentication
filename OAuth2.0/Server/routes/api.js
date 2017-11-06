var express = require('express');
var router = express.Router();
var utils = require('../lib/utils');
var resourceModel = require('../models/resource');
var rdsStore = require('../models/rdsStore');
var debug = require('debug')('Server:api');

router.post('/resource', init, checkToken, getResource);

// 初始化
function init (req, res, next) {
    res.locals.state = {
        errCode: 0,
        errMsg: ''
    }
    next();
}

// 校验 access_token
function checkToken (req, res, next) {
    var clientId = req.body.clientId;
    var asccessToken = req.body.asccessToken;

    rdsStore.get(clientId).then(reply => {
        if (reply && reply.tokenInfo.access_token === asccessToken) {
            debug('Token 校验成功', reply);
            if ((Date.now() - reply.tokenInfo.timestamp) / 1000 > reply.tokenInfo.expires_in) {
                res.locals.state.errCode = -101
                res.locals.state.errMsg = 'token 已过期';
            } else {
                res.locals.userInfo = reply.userInfo;
            }
        } else {
            res.locals.state.errCode = -100
            res.locals.state.errMsg = '身份验证失败';
        }
        next();
    }, err => {
        console.log(err);
        debug('获取 token 失败');
        res.locals.state.errCode = -110
        res.locals.state.errMsg = '身份验证失败';
        next();
    });
}

// 获取资源
function getResource (req, res, next) {
    if (res.locals.state.errCode === 0) {
        resourceModel.getResourceByUid(res.locals.userInfo.id).then(rows => {
            res.locals.state.userInfo = {
                userName: res.locals.userInfo.user_name,
                userNickname: res.locals.userInfo.user_nickname
            }
            res.locals.state.resources = rows;
            res.send(res.locals.state);
        }, err => {
            res.locals.state.errCode = -200
            res.locals.state.errMsg = '远程服务器获取资源失败';
            res.send(res.locals.state);
        });
    } else {
        res.send(res.locals.state);
    }
}

module.exports = router;
