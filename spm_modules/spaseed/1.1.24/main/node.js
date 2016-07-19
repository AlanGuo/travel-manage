'use strict';


var $ = require('$'),
	mp = require('mp');

var Node = mp.Class.extend({

	$elem:null,
	$event:null,

	nodeName:'div',

	ctor:function(data){
		if(!data){data = {}}

		this.nodeName = data.nodeName || 'div';
		this.$elem =  this.$elem || data.$elem;
		if(!this.$elem){
			this.isNew = true;
			this.$elem = $(document.createElement(this.nodeName));
		}

		this.className = data.className;
		if(this.className){
			this.$elem.addClass(this.className);
		}

		//其他属性
		this.attribute = data.attribute || {};
		//属性
		for(var p in this.attribute){
			this.$elem.attr(p,this.attribute[p]);
		}
	},

	addChild:function(child){
		this.$elem.append(child.$elem);
		child.parent = this;
	},

	removeChild:function(child){
		child.parent = null;
		child.$elem.remove();
	}
})

module.exports = Node;
