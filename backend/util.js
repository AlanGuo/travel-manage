var util = {
	jsonRespond : function(response, json, options){
		options = options || {};

		var defaultResponseHeader = {
			'Content-Type':'application/json;charset=UTF-8'
		};
		for(var p in options){
			defaultResponseHeader[p] = options[p]
		}
		
		response.writeHead(options.status || '200',defaultResponseHeader);
		response.end(json?JSON.stringify(json):'','utf-8');
	}
};

module.exports = util;