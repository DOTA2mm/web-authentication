var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('./home');
});

router.use('/login', require('./login'));
router.use('/home', require('./home'));

module.exports = router;
