var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.headers.authorization) {
    const authInfo = req.headers.authorization;
    const keyInfo = new Buffer(authInfo.slice(6), 'base64').toString();
    const user = keyInfo.split(':')[0];
    const pwd = keyInfo.split(':')[1];
    if (user === '123' && pwd === 'abc') {
      res.render('index', {title: 'Express'});
      return;
    }
  }
  res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
  res.setHeader('Content-Type', 'text/html');
  res.status(401).end('Not Authorization');
});

module.exports = router;
