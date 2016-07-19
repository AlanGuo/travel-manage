'use strict';


var $ = require('$'),
	Node = require('Node');

var View = Node.extend({
	_:'',
	/*标题*/
	title:'',
	/*内部元素*/
	elements:{},

	$elem:$('#container'),

	ctor:function(data){
		this.$super(data);
		
		this.$app = data.$app;
		//可以动态设定$elem
		this.$elem = data.$elem || this.$elem;
		//共享网络和事件
		this.$net = this.$app.$net;
		this.$net.caller = this;
		//事件
		this.$event = this.$app.$event;
		this.$on = this.$app.$event.on;
		this.$off = this.$app.$event.off;
		this.$emit = this.$app.$event.emit;
		this.$router = this.$app.$router;

		this.bindEvents();
	},
	bindEvents:function(){
		//绑定events
		if(this.events){
			this.__bodyhandler = this.__bodyhandler || {};
			for(var p in this.events){
				var hasq = false;
				for(var q in this.events[p]){
					hasq = true;
					this.$event.on(this,p,q,this.events[p][q]);
				}
				if(hasq){
					//绑定事件
					this.__bodyhandler[p] = this.$event.bindEvent(this, this.$elem, p);
				}
			}
		}
	},
	/*重载*/
	render:function(){
	},
	/*重载*/
	reload:function(){
	},
	/*重载*/
	destroy:function(){
		//移除事件
		this.$event.off(this);

		for(var p in this.events){
			this.$event.unbindEvent(this.$elem, p, this.__bodyhandler[p]);
		}
	}
})

module.exports = View;
