const mysql = require('promise-mysql');
const conf = require('../lib/config');
const debug = require('debug')('Models')

const userModel = {};

const connPool = mysql.createPool({
  host: conf.mysql.host,
  user: conf.mysql.username,
  password: conf.mysql.password,
  database: conf.mysql.database,
  connectionLimit: 10
});

userModel.queryUser = function (username, password) {
  debug(`SELECT * FROM as_users WHERE user_name = '${username}' and user_pwd = '${password}';`);
  return connPool.query(`SELECT * FROM as_users WHERE user_name = '${username}' and user_pwd = '${password}';`)
}

module.exports = userModel;
