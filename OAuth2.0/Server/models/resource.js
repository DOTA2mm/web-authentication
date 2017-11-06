const mysql = require('promise-mysql');
const conf = require('../lib/config');
const debug = require('debug')('Server:models.resource');

const resourceModel = {};

const connPool = mysql.createPool({
  host: conf.mysql.host,
  user: conf.mysql.username,
  password: conf.mysql.password,
  database: conf.mysql.database,
  connectionLimit: 10
});

resourceModel.getResourceByUid = function (uid) {
  debug(`SELECT r_link, r_title, r_desc FROM rs_photos WHERE u_id = '${uid}';`);
  return connPool.query(`SELECT * FROM rs_photos WHERE u_id = '${uid}';`);
}

module.exports = resourceModel;
