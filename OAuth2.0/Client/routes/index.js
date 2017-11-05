var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('./login');
});

router.use('/login', require('./login'));
router.use('/auth', require('./authorize'));

module.exports = router;
