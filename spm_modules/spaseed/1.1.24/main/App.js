'use strict';

var Node = require('Node'),
	Event = require('Event'),
	$ = require('$'),
	Net = require('Net'),
	Router = require('AppRouter');

var App = Node.extend({
	cache:{},
	config:{root:'/index'},

	ctor:function(data){
		this.config = $.extend(this.config, data);
		this.$super(this.config);
		//路由
		this.$router = Router.create(this);
		//网络
		this.$net = Net.create(this);
		//事件
		this.$event = Event.create(this);
		this.$on = this.$event.on;
		this.$off = this.$event.off;
		this.$emit = this.$event.emit;

		//router事件
		var self = this;
		this.$event.on(this,'click','router',function(target){
			var url = target.getAttribute('data-href');
			if(url){
				self.$router.loadUrl(target.getAttribute('data-href'));
			}
		});
		this.$event.on(this,'click','back',function(){
			self.$router.backView();
		});
		this.__bodyhandler = {};
		//绑定click事件
		this.__bodyhandler.click = this.$event.bindEvent(this, this.$elem, 'click');
	},

	launch:function(){
		this.$router.launch();
	}
});

App.create = function(data){
	return new App(data);
}

module.exports = App;
