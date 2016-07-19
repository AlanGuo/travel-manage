'use strict';


var cookie = {
	get:function(name){
		var cookieStr = document.cookie;
		var reg = new RegExp(name + '=(.*?)(;|$)');
		var val = reg.exec(cookieStr);

		return val && val[1];
	},

	set:function(name, value, path, expires){
		var expDays = expires * 24 * 60 * 60 *100;
		var expDate = new Date();
		expDate.setTime(expDate.getTime()+expDays);
		var expString = expires?'; expires='+expDate.toGMTString():'';
		var pathString = ';path='+path;
		document.cookie = name+'='+escape(value)+expString+pathString;
	},

	'delete':function(name){
		var exp = new Date(new Date().getTime()-1);
		var s = this.get(name);

		if(s!=null){
			document.cookie = name+'='+s+'; expires='+exp.toGMTString()+';path=/';
		}
	}
};

module.exports = cookie;
