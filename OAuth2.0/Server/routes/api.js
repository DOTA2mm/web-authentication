var express = require('express');
var router = express.Router();
var utils = require('../lib/utils');
var clientModel = require('../models/client');
var rdsStore = require('../models/rdsStore');
var debug = require('debug')('Server:authorize');