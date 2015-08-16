'use strict';


var Node = require('Node')

var ErrorTips = Node.extend({
	ctor:function(data){
		data = data || {};
		data.className = '';
		this.$super(data);

		this.$parent = data.$parent;
		this.duration = data.duration;

		//默认class
		this.$elem.addClass('layout-err-tips');
		this.$elem.hide();

		if(this.$parent){
			//加入元素节点
			var elem = this.$elem.length?this.$elem[0]:this.$elem;
			if(this.$parent.children().indexOf(elem)===-1){
				this.$parent.append(this.$elem);
			}
		}
	},
	show:function(content, options){
		var self = this;
		options = options || {};
		setTimeout(function(){
			self.$elem.addClass('fade-out');
		},this.duration || 3000);

		this.$elem.text(content);
		this.hide();
		this.$elem.removeClass('fade-out');
		this.$elem.width();
		this.$elem.show();
	},
	hide:function(){
		this.$elem.hide();
	}
});

ErrorTips.create = function(data){
	return new ErrorTips(data);
};

module.exports = ErrorTips;