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
	},
	province:{
		url:'/cgi-bin/province/list',
		method:'get'
	},
	getRegion:{
		url:'/cgi-bin/region/get',
		method:'get'
	},
	addRegion:{
		url:'/cgi-bin/region/add',
		method:'post'
	},
	modifyRegion:{
		url:'/cgi-bin/region/modify',
		method:'post'
	},
	deleteRegion:{
		url:'/cgi-bin/region/delete',
		method:'get'
	}
};

module.exports = request;
