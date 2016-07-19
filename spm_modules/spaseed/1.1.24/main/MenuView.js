'use strict';

var $ = require('$'),
	View = require('View');

var MenuView = View.extend({
	ctor:function(data){
		this.$super(data);
		this.data = data;
	},
	elements:{},
	render:function(){},
	events:{
		'click':{
			'select':function(target){
				this.$elem.find(this.data.itemtype || 'li').removeClass('active');
				$(target).addClass('active');
				return true;
			}
		}
	}
});

module.exports = MenuView;