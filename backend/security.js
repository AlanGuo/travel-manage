var ccap = require('ccap');
var vercode = '';

var security = {
	vercode:function(){
		return vercode;
	},
	///cgi-bin/secure/verifycode
	verifycode:function(pathname, request, response, config){
		var captcha = ccap({
			width:100,
			height:35,
			offset:22,
			fontsize:32,
			generate:function(){
				//Custom the function to generate captcha text
		        //generate captcha text here
		        //return the captcha text
		        var text = (Math.random()*10000).toPrecision(4).replace(/\./,'');
		        return text;
		    }
		});
		var ary = captcha.get();
		
		//ary[0] is captcha's text,ary[1] is captcha picture buffer.
		vercode = ary[0];

		var buffer = ary[1];
		response.writeHead('200',{
			'Content-Type':'image/jpeg'
		});
		response.end(buffer);
	}
};

module.exports = security;