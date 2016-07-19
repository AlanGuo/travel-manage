'use strict';

var $ = require('$'),
	View = require('View'),
	template = require('template');

var TopBottomView = View.extend({
	$elem:$('#wrapper-all'),
	/*内部元素*/
	elements:{
	},

	ctor:function(data){
		this.$super(data);
		var top = $('#top'),
			bottom = $('#bottom'),
			container = $('#container');

		if(!top.length || !bottom.length || !container.length){
			this.$elem.html(template('topbottomtemplate'));
			this.elements.$top = $('#top');
			this.elements.$bottom = $('#bottom');
			this.elements.$container = $('#container');
		}
		else{
			this.elements.$top = top;
			this.elements.$bottom = bottom;
			this.elements.$container = container;
		}
	},

	renderContent:function(option){
		this.elements.$container.html(option.container);
		this.elements.$top.html(option.top);
		this.elements.$bottom.html(option.bottom);
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
		this.$super();
	}
})

module.exports = TopBottomView;
