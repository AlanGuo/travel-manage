'use strict';

var request = {
	signin:{
		url:'/cgi-bin/admin/signin',
		method:'post'
	},
	signup:{
		url:'/cgi-bin/admin/signup',
		method:'post'
	},
	getAudio:{
		url:'/cgi-bin/audio/get'
	},
	addAudio:{
		url:'/cgi-bin/audio/add',
		method:'post',
		contentType:false
	}
};

module.exports = request;
