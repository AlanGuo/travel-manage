'use strict';

var mp = require('mp');

var Console = mp.Class.extend({
	messages:[],
	ctor:function(mpNode){

		var layout = document.createElement('ul');

		layout.style.position = "absolute";
		layout.style.top ="0";
		layout.style.zIndex = "2147483647"
		layout.style.background = "#fff";
		layout.style.border = "1px solid #ccc";
		layout.style.padding = "5px";

		this.layout = layout;
	},
	log:function(message,fl){

		fl = fl || 'left';

		this.messages.unshift(message);
		this.messages.length = 10;
		this.layout.innerHTML = this.messages.join('<br>');

		if(!this.layout.parentNode){
			this.layout.style[fl] = "0";
			document.body.appendChild(this.layout);
		}
	}
});

Console.create = function(mpNode){
	return new Console(mpNode);
}

module.exports = Console;
