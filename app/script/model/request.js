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
	getPayment:{
		url:'/cgi-bin/payment/get',
		method:'get'
	},
	getAudio:{
		url:'/cgi-bin/audio/get',
		method:'get'
	},
	deleteAudio:{
		url:'/cgi-bin/audio/delete'
	},
	addAudio:{
		url:'/cgi-bin/audio/add',
		method:'post',
		contentType:false
	},
	updateAudio:{
		url:'/cgi-bin/audio/update',
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
	updateRegion:{
		url:'/cgi-bin/region/update',
		method:'post'
	},
	deleteRegion:{
		url:'/cgi-bin/region/delete',
		method:'get'
	}
};

module.exports = request;
