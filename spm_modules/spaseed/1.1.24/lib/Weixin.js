'use strict';

var Node = require('Node'),
	Mask = require('Mask'),
	template = require('template');

var Weixin = Node.extend({
	ctor:function(data){
		data = data || {};
		data.className = '';
		this.$super(data);
		this.$parent = data.$parent;

		this.$elem.addClass('popup-wxshare');
		this.$elem.hide();

		if(this.$parent){
			//遮罩元素
			var elem = this.$elem.length?this.$elem[0]:this.$elem;
			if(this.$parent.children().indexOf(elem)===-1){
				this.$parent.append(this.$elem);
			}
		}

		var self = this;
		var close = function(){
			self.$elem.hide();
			self.$mask.hide();
		};
		this.$elem[0].addEventListener('touchstart',close);
		this.$mask = data.$mask || Mask.create(data);
	},
	share: function(){
		var self = this;
		this.$elem.html(template('weixin/share'));
		this.$elem.show();
		this.$mask.show();

		setTimeout(function(){
			self.$elem.hide();
			self.$mask.hide();
		},5000);
	},
	openInBrowser: function(){
		var self = this;
		this.$elem.html(template('weixin/openinbrowser'));
		this.$elem.show();
		this.$mask.show();

		setTimeout(function(){
			self.$elem.hide();
			self.$mask.hide();
		},5000);
	}
});

Weixin.create = function(data){
	return new Weixin(data);
};

module.exports = Weixin;