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
							success:function(data){
								resolve(data);
							},
							error:function(err){
								reject(err);
							}
						});
					}));
				})(requestArray[i],i);
			}

			Promise.all(promiseFunctionArray).then(function(values){
	           if(success){
	           		success(values);
	           }
	        }).catch(function(errs){
	        	if(fail){
	        		fail(errs);
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