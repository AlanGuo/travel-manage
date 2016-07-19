'use strict';
 

var Node = require('Node')

var Mask = Node.extend({
	ctor:function(data){
		data = data || {};
		data.className = '';
		this.$super(data);

		this.$parent = data.$parent;

		//默认class
		this.$elem.addClass('mask');
		this.$elem.hide();

		if(this.$parent){
			//遮罩元素
			var elem = this.$elem.length?this.$elem[0]:this.$elem;
			if(this.$parent.children().indexOf(elem)===-1){
				this.$parent.append(this.$elem);
			}
		}
	},
	show:function(html, options){
		//调整高度到滚动高度
		this.$elem.css('height', document.body.scrollHeight+'px');
		this.$elem.show();
	},
	hide:function(){
		this.$elem.removeAttr('style');
		this.$elem.hide();
	}
});

Mask.create = function(data){
	return new Mask(data);
}

module.exports = Mask;