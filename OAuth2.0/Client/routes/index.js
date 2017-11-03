var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('./OAuth2/authorize');
});

router.use('/login', require('./login'));
router.use('/callback', require('./authorize'));

module.exports = router;
