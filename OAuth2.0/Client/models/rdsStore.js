const redis = require('redis');
const conf = require('../lib/config');

const client = redis.createClient({
    host: conf.redis.host,
    port: conf.redis.port,
    db: 2
});
const store = {};

client.on('error', err => {
    console.log(err);
});

store.set = function (key, obj, expires) {
    return new Promise((resolve, reject) => {
        client.set(key, JSON.stringify(obj), (err, reply) => {
            if (err) {
                reject(err);
            } else {
                client.expire(key, expires || -1);
                console.log(reply);
                resolve(reply);
            }
        });
    });
}

store.get = function (key) {
    return new Promise((resolve, reject) => {
        client.get(key, (err, reply) => {
            if (err) {
                reject(err);
            } else {
                let val = reply;
                let valObj = null;
                try {
                    valObj = JSON.parse(val);
                } catch (err) {
                    reject(err);
                }
                if (valObj) {
                    resolve(valObj);
                } else {
                    reject(new Error('Response is null.'))
                }
            }
        });
    });
}

store.del = function (key) {
    return new Promise((resolve, reject) => {
        client.del(key, (err, reply) => {
            if (err) {
                reject(err);
            } else {
                resolve(reply);
            }
        });
    });
}

module.exports = store;
