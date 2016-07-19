'use strict';

define(function(require, exports,module) {
	var wx = {
		share: function(){
			var helper = $('<div class="popup-wxshare"><span class="share-wx">点击右上角，分享到朋友圈</span><a class="icon-close"> 点击关闭</a></div>');
			this.showMask();
			helper.appendTo('body');

			var close = function(){
				dialog.hideMask();
				helper.remove();
				helper = undefined;
			};
			helper.on('touchstart',close);
			setTimeout(function(){
				if(helper){
					close();
				}
			},5000);
		},
		openInBrowser: function(){
			var helper = $('<div class="popup-wxshare"><span class="pay-wx">点击右上角，用浏览器打开再支付</span><a class="icon-close"> 点击关闭</a></div>');
			this.showMask();
			helper.appendTo('body');

			var close = function(){
				dialog.hideMask();
				helper.remove();
				helper = undefined;
			};
			helper.on('touchstart',close);
			setTimeout(function(){
				if(helper){
					close();
				}
			},5000);
		}
	};
});