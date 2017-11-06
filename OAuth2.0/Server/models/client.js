const mysql = require('promise-mysql');
const conf = require('../lib/config');
const debug = require('debug')('Server:models.client');

const clientModel = {};

const connPool = mysql.createPool({
  host: conf.mysql.host,
  user: conf.mysql.username,
  password: conf.mysql.password,
  database: conf.mysql.database,
  connectionLimit: 10
});

clientModel.queryClientInfoById = function (clientId) {
    debug(`SELECT * FROM as_clients WHERE c_id = '${clientId}';`);
    return connPool.query(`SELECT * FROM as_clients WHERE c_id = '${clientId}';`);
}

module.exports = clientModel;
