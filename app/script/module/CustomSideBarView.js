'use strict';

var $ = require('$'),
	cookie = require('cookie'),
	SideBarView = require('SideBarView');

var CustomSideBarView = SideBarView.extend({
	$elem:$('#wrapper-all'),
	/*其他控制元素*/
	elements:{},

	ctor:function(data){
		var name = cookie.get('usernick');

		if(name){
			data.sidebarData = {user:name};
		}

		this.$super(data);
	},
	bindEvents:function(){
		this.$event.on(this,'click','signout',function(){
			xlQuickLogin.logout();
		});
		
		if(this.events){
		 	this.$super();
		}
		else{
			this.__bodyhandler = {};
			this.__bodyhandler.click = this.$event.bindEvent(this, this.$elem, 'click');
		}
	}
});

module.exports = CustomSideBarView;
