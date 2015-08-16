'use strict';


var formatchecker = {
	isMobile:function(data){
		if(/^1\d{10}$/.test(data)){
		  return true;
		}
    },

    isEmail:function(data){
    	if(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(data)){
    		return true;
    	}
    },

    isDate:function(data){
    	if(/^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[1-2]\d|3[0-1])$/.test(data)){
    		return true;
    	}
    },

    isIP:function(data){
    	if(/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/.test(data)){
    		return true;
    	}
    },

    isPassword:function(data){
    	if(data.length>6){
    		return true;
    	}
    },

    notEmpty:function(data){
    	if(data && data.length){
    		return true;
    	}
    }
};

module.exports = formatchecker;