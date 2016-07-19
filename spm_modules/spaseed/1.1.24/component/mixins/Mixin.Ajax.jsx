
function http(url,method,params,callback) {
	var xhr = new XMLHttpRequest();
	xhr.onload = function(){
		var ret = JSON.parse(xhr.responseText)
		callback(ret);
	}
    xhr.open(method,url,true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(params);
}


module.exports = {
	get:function (url,callback) {
		http(url,'GET',null,function(ret){
			callback.call(this,ret)
		}.bind(this));
	},
	post:function (url,params,callback) {
		var arr = [];
		for(var p in params){
			arr.push(p+'='+encodeURIComponent(params[p]));
		}
		http(url,'POST',arr.join('&'),function(ret){
			callback.call(this,ret)
		}.bind(this));
	}
}

