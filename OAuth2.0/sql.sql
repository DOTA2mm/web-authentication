# 申请接入的第三方应用
CREATE TABLE oauth_clients (
	id INT UNSIGNED PRIMARY KEY auto_increment COMMENT '自增id',
	c_id CHAR(10) NOT NULL COMMENT 'client_id 即 app_key',
	c_secrect CHAR(25) NOT NULL COMMENT 'app_secret',
	c_name VARCHAR(255) NOT NULL COMMENT '第三方应用名称',
	c_desc VARCHAR(255) DEFAULT NULL COMMENT '第三方应用slogen',
	c_redirecturi VARCHAR(255) NOT NULL COMMENT '重定向url'
) ENGINE = INNODB CHARSET = utf8 COMMENT '申请接入的第三方应用';
# 插入第三方应用数据
INSERT INTO oauth_clients VALUES (
	NULL,
	'4GU8Am5xxN',
	'8Ncu1Xah5fYBjiYwQ3gGnZ42v',
	'优品股票通',
	'世界上最好用的炒股软件',
	'http://localhost:1002/auth/callback'
);
# 用户信息RO
CREATE TABLE resource_owners (
	id INT PRIMARY KEY AUTO_INCREMENT COMMENT '用户id',
	user_name VARCHAR(10) NOT NULL COMMENT '用户名',
	user_pwd VARCHAR(15) NOT NULL COMMENT '密码',
	user_nickname VARCHAR(15) DEFAULT '' COMMENT '昵称'
) ENGINE = INNODB CHARSET = utf8 COMMENT '注册用户表';
# 插入一条用户信息
INSERT INTO resource_owners VALUES (
	NULL,
	'upchina',
	'upchina333',
	'优品财富'
);
# 表结构更新
ALTER TABLE oauth_clients ADD c_icon VARCHAR(200) AFTER c_redirecturi;
UPDATE oauth_clients SET c_icon = 'http://img.upchinapro.com/share/logo/up.png' WHERE id = 1;

UPDATE resource_owners SET user_nickname = '港草' WHERE id = 1;
ALTER TABLE oauth_clients RENAME AS_clients;
ALTER TABLE resource_owners RENAME AS_users;

# 资源服务器图片资源
CREATE TABLE rs_photos (
	id int(11) NOT NULL AUTO_INCREMENT COMMENT '资源id',
	u_id int(11) NOT NULL COMMENT '对应用户id',
	r_link VARCHAR(255) NOT NULL COMMENT '图片资源链接',
	r_title VARCHAR(20) DEFAULT '图片资源' COMMENT '图片title',
	r_desc VARCHAR(150) COMMENT '图片资源描述'
)
