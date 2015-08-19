var connection = require('./connection'),
	admin = require('./admin'),
	security = require('./security'),
	region = require('./region'),
	audio = require('./audio'),
	payment = require('./payment'),
	province = require('./province');

connection.init();

exports.admin = admin;
exports.security = security;
exports.region = region;
exports.province = province;
exports.audio = audio;
exports.payment = payment;