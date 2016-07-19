'use strict';

var request = {
	signin:{
		url:'/cgi-bin/admin/signin',
		method:'post'
	},
	uploadfile:{
		url:'/cgi-bin/file/upload',
		method:'post',
		contentType:false
	},
	push:{
		url:'/cgi-bin/file/push',
		method:'post'
	},
	querydevice:{
		url:'/cgi-bin/file/querydevice',
		method:'post'
	}
};

module.exports = request;
