'use strict';
 
var Node = require('Node'),
	template = require('template');

var Mask = Node.extend({
	ctor:function(data){
		data = data || {};
		data.className = '';
		this.$super(data);

		this.$parent = data.$parent;

		//默认class
		this.$elem.addClass('wrap-loading');
		this.$elem.html(template('loading'));
		this.$elem.hide();

		if(this.$parent){
			var elem = this.$elem.length?this.$elem[0]:this.$elem;
			if(this.$parent.children().indexOf(elem)===-1){
				this.$parent.append(this.$elem);
			}
		}
	},
	show:function(html, options){
		this.$elem.show();
	},
	hide:function(){
		this.$elem.hide();
	}
});

Mask.create = function(data){
	return new Mask(data);
}

module.exports = Mask;