const mysql = require('promise-mysql');
const conf = require('../lib/config');
const debug = require('debug')('Models')

const clientModel = {};

const connPool = mysql.createPool({
  host: conf.mysql.host,
  user: conf.mysql.username,
  password: conf.mysql.password,
  database: conf.mysql.database,
  connectionLimit: 10
});

clientModel.queryClientInfoById = function (clientId) {
    return connPool.query(`SELECT * FROM oauth_clients WHERE c_id = '${clientId}';`);
}

module.exports = clientModel;
