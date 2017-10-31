const mysql = require('promise-mysql');
const conf = require('../lib/config');
const debug = require('debug')('Models')

const userModel = {};
const connect = mysql.createConnection({
  host: conf.db.host,
  user: conf.db.username,
  password: conf.db.password,
  database: conf.db.database
});

userModel.queryUser = function (username, password) {
  debug(username, password);
  connect.then(conn => {
    return conn.query(`select * from resource_owners where user_name = '${username}' and user_pwd = '${password}';`);
  })
}

module.exports = userModel;
