'use strict';


var Router = require('Router');

var H5Router = Router.extend({

	init:function(){
		var self = this;
		window.addEventListener('popstate',function(e){
			if(e.state){
				if(e.state.url){
					if(e.state.historyIndex && e.state.historyIndex < self.historyIndex){
						//控制app跳转
						self.backView();
					}
					else{
						e.state.option.browser = true;
						//控制app跳转
						self.loadUrl(e.state.url,e.state.option);
					}
					
				}
			}
		});
	},
	push:function(url,option,view){
		this.history.push([url,option,view.$elem.html()]);
		if(this.history.length > 10){
			this.history = this.history.slice(5);
		}
		this.historyIndex++;

		if(!option.browser){
			history.pushState({url:url,option:option,historyIndex:self.historyIndex},view.title,url);
		}

	},
	pop:function(){
		this.history.pop();

		var record = this.history.pop() || ['','',''];
		record.push('right');

		return record;
	},
	launch:function(){
		this.loadUrl(window.location.path);
	}
});

H5Router.create = function(app){
	return new H5Router(app);
}

module.exports = H5Router;
