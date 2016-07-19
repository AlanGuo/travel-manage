/**
 * promise
 * @class promise
 * @static
 */
'use strict';

var asyncRequest = {
	all:function(net, requestArray, success, fail){
		if(window.Promise){
			var promiseFunctionArray = [];
			for(var i=0;i<requestArray.length;i++){
				(function(item,index){
					promiseFunctionArray.push(new Promise(function(resolve, reject){
						net.request({
							request:item.request,
							data:item.params,
							success:function(){
								if(item.success){
									resolve.apply(this,arguments);
									return item.success.apply(this,arguments);
								}
								else{
									resolve.apply(this,arguments);
								}
							},
							error:function(){
								if(item.fail){
									reject.apply(this,arguments);
									return item.fail.apply(this,arguments);
								}
								else{
									reject.apply(this,arguments);
								}
							}
						});
					}));
				})(requestArray[i],i);
			}

			Promise.all(promiseFunctionArray).then(function(){
	           if(success){
	           		success.apply(this,arguments);
	           }
	        }).catch(function(){
	        	if(fail){
	        		fail.apply(this,arguments);
	        	}
	        	else{
	        		throw errs;
	        	}
	        });
		}else{
			var count = requestArray.length;
			var resultsArray = new Array(count);
			//不支持Promise的情况
			for(var i=0;i<count;i++){
				(function(item,index){
					net.request({
						request:item.request,
						data:item.params,
						success:function(data){
							resultsArray[index] = data;
							if(!--count){
								if(success){
									success(resultsArray);
								}
							}
						},
						error:function(err){
							resultsArray[index] = err;
							if(!--count){
								if(fail){
									fail(resultsArray);
								}
							}
						}
					});
				})(requestArray[i],i);
			}
		}
	}
};

module.exports = asyncRequest;