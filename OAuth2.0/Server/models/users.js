const mysql = require('promise-mysql');
const conf = require('../config');

const userModel = {};
const connect = mysql.createConnection({
  host: conf.db.host,
  user: conf.db.username,
  password: conf.db.password,
  database: conf.db.database
});

userModel.queryUser = function (username) {
  connect.then(conn => {
    return conn.query(`select * from resource_owners where username = ${username}`);
  })
}

module.exports = userModel;
