var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.setHeader(
    'WWW-Authenticate',
    'Digest realm="Secure Area",qop="auth",nonce="dcd98b7102dd2f0e8b11d0f600bfb0c093",opaque="5ccc069c403ebaf9f0171e9517f40e41"'
  );
  res.setHeader('Content-Type', 'text/html');
  res.status(401).end('Not Authorization');
});

module.exports = router;
