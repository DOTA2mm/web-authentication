const mysql = require('promise-mysql');
const conf = require('../lib/config');
const debug = require('debug')('Models')

const userModel = {};

const connPool = mysql.createPool({
  host: conf.db.host,
  user: conf.db.username,
  password: conf.db.password,
  database: conf.db.database,
  connectionLimit: 10
});

userModel.queryUser = function (username, password) {
  debug(username, password);
  return connPool.query(`select * from resource_owners where user_name = '${username}' and user_pwd = '${password}';`)
}

module.exports = userModel;
