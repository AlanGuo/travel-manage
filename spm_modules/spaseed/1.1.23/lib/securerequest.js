'use strict';

var cookie = require('cookie');

var gettk=function(name){
		var _skey = cookie.get(name);
		if(_skey){
			var hash = 5381;

			for (var i = 0, len = _skey.length; i < len; ++i) {
				hash += (hash << 5) + _skey.charCodeAt(i);
			}
			return hash & 0x7fffffff;
		}		
	}
};

var securerequest = {
	create:function (option) {

		var cgi = option.url;
		var params = [];

		var tk = gettk('skey');
		if(tk){
			params.push('tk='+tk);
		}
		
		if(params.length){
			cgi += /\?/.test(cgi) ? '&' : '?';
			cgi += params.join('&');
		}

		return {
			url:cgi,
			method:option.method
		};
	}
};

module.exports = securerequest;
