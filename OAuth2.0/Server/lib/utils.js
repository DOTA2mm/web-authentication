/**
 * 工具函数
 */
var crypto = require('crypto');
var desIv = Buffer.from('tfhk1597');
var desKy = Buffer.from('89h5f6kt');
var utils = {};

// 随机长度字符串
utils.randomWord = function (randomFlag, min, max) {
    var str = '';
    var range = min;
    var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    // 随机产生
    if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;
    }
    for (var i = 0; i < range; i++) {
        let pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
};

// MD5 加密
utils.encryptMd5 = function (encryptStr) {
    var md5 = crypto.createHash('md5');
    md5.update(encryptStr);
    return md5.digest('base64');
};

// DES 加密
utils.encryptDes = function (encryptStr, key, iv) {
    key = key || desKy;
    iv = iv || desIv;
    var cipher = crypto.createCipheriv('des-cbc', key, iv);
    var encrypt = cipher.update(encryptStr, 'utf8', 'base64');
    encrypt += cipher.final('base64');
    return encrypt;
};

// DES 解密
utils.decryptDes = function (decryptStr, key, iv) {
    key = key || desKy;
    iv = iv || desIv;
    var decipher = crypto.createDecipheriv('des-cbc', key, iv);
    var decrypt = decipher.update(decryptStr, 'base64', 'utf8');
    decrypt += decipher.final('utf8');
    return decrypt;
};

module.exports = utils;
