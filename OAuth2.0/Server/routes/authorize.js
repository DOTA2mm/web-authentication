var express = require('express');
var router = express.Router();

router.get('/', checkLogin, function (req, res, next) {
  res.render('authorize', {title: 'OAuth2.0'});
});

function checkLogin (req, res, next) {
  if (req.session.userInfo) {
    next();
  } else {
    res.redirect('./login');
  }
}

module.exports = router;
