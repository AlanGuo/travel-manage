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
	}
});

module.exports = CustomSideBarView;
