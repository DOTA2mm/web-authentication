var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('./OAuth2/authorize');
});

router.use('/OAuth2/login', require('./login'));
router.use('/OAuth2/authorize', require('./authorize'));
router.use('/api', require('./api'));

module.exports = router;
