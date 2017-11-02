const redis = require('redis');
const conf = require('../lib/config');

const client = redis.createClient({
    host: conf.redis.host,
    port: conf.redis.port
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
                client.expire(key, expires);
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
                try {
                    let valObj = JSON.parse(val);
                } catch (err) {
                    reject(err);
                }
                resolve(valObj);
            }
        })
    })
}

module.exports = store;
