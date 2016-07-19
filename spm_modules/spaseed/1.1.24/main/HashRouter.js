'use strict';


var Router = require('Router');

var HashRouter = Router.extend({

	ctor:function(app){
		this.$app = app;
	},

	init:function(){
		var self = this;
		window.addEventListener('hashchange',function(e){
			var newHash = location.hash.substring(1);
			self.loadUrl(newHash);
		});

		//first time load
		var newHash = location.hash.substring(1);
		self.loadUrl(newHash);
	}
});

HashRouter.create = function(app){
	return new HashRouter(app);
}

module.exports = HashRouter;
