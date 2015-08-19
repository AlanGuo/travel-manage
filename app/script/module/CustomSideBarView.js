'use strict';

var $ = require('$'),
	cookie = require('cookie'),
	SideBarView = require('SideBarView');

var CustomSideBarView = SideBarView.extend({
	$elem:$('#wrapper-all'),
	/*其他控制元素*/
	elements:{},

	ctor:function(data){
		var uin = cookie.get('uin'),
			skey = cookie.get('skey');

		if(uin && skey){
			data.sidebarData = {user:uin};
		}
		else{
			location.href = '/#/account/signin';
		}
		this.$super(data);

		this.$event.on(this,'click','signout',function(){
			cookie['delete']('uin');
            cookie['delete']('skey');

            location.href = '/#/account/signin';
		});

		this.__sideBarHandler = {};
		//绑定click事件
		this.__sideBarHandler.click = this.$event.bindEvent(this, this.$elem, 'click');
	}
});

module.exports = CustomSideBarView;
