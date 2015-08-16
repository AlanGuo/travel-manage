var connection = require('./connection'),
	admin = require('./admin'),
	security = require('./security'),
	product = require('./product');

connection.init();

exports.admin = admin;
exports.security = security;
exports.product = product;