'use strict';

var observeObj = {};

var observer = {
	register : function(observeEvt, fn, callerObj){
		if(observeObj[observeEvt]){
			observeObj[observeEvt].push({callerObj : callerObj, fn : fn});
		}else{
			observeObj[observeEvt] = [{callerObj : callerObj, fn : fn}];
		}
	},

	unregister : function(observeEvt, fn){
		if(observeObj[observeEvt]){
			for(var i = 0, ilen = observeObj[observeEvt].length; i < ilen; i++){
				if(observeObj[observeEvt][i].fn === fn){
					observeObj[observeEvt].splice(i, 1);
					break;
				}
			}
		}
	},

	trigger : function(observeEvt, params){
		if(observeObj[observeEvt]){
			for(var i = 0, ilen = observeObj[observeEvt].length; i < ilen; i++){
				var paramObj = observeObj[observeEvt][i];
				paramObj.callerObj[paramObj.fn](params);
			}
		}
	}

};

module.exports = observer;