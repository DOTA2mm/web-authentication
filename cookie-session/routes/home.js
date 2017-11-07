var express = require('express');
var router = express.Router();

router.get('/', init, checkLogin, function (req, res, next) {
    if (res.locals.state.errCode === 0) {
        res.render('index');
    } else {
        res.redirect('./login');
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
function checkLogin (req, res, next) {
    var sessionId = req.cookies.connsid;
    if (sessionId && global.SESSION[sessionId]) {
        res.locals.userInfo = global.SESSION[sessionId].userInfo;
    } else {
        res.locals.state.errCode = -200;
    }
    next();
}

module.exports = router;
