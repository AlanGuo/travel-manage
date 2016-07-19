'use strict';

var config = {

	/**
	 * 默认标题
	 * @property defaultTitle
	 * @type String
	 * @default 'spaseed'
	 */
	'title': 'spaseed',

	'mask':'#mask',

	/**
	 * 首页模块名
	 * @property root
	 * @type String
	 * @default 'home'
	 */
	'root': '/index',

	/**
	 * 视图目录
	 * @property viewfolder
	 * @type Object
	 * @default {}
	 */
	'viewfolder':'app/script/module',

	/**
	 * 404提示
	 * @property 404Html
	 * @type String
	 * @default '<h2 id="tt404" style="text-align:center;padding-top:100px;font-size:20px;line-height:1.5;color:#999">'+
			   ' <p style="font-size:44px">404</p> 您访问的页面没有找到! </h2>'
	 */
	'html404': '<h2 id="tt404" style="text-align:center;padding-top:100px;font-size:20px;line-height:1.5;color:#999">'+
			   ' <p style="font-size:44px">404</p> 您访问的页面没有找到</h2>',

	/**
	 * 请求错误默认提示文字
	 * @property defaultReqErr
	 * @type String
	 * @default '连接服务器异常，请稍后再试'
	 */
	'defaultReqErr': '连接服务器异常，请稍后再试',

	/**
	 * xhr请求进度条，需要后台字段支持
	 * @property xhrProgress
	 * @type boolean
	 * @default false
	 */
	 'xhrProgress':true,

	/**
	 * 禁止container以外元素的touch事件
	 * @property disableTouchOutsideContainer
	 * @type boolean
	 * @default true
	 */
	 'disableTouchOutsideContainer': true,

	 /**
	 * 统计id，目前支持的是baidu统计
	 * @property statsId
	 * @type String
	 * @default ''
	 */
	 'statsId':'a2ede337a0b21b2991bd02c69befdc07',

	 /**
	 * 默认开启统计
	 * @property defaultStats
	 * @type boolean
	 * @default true
	 */
	 'defaultStats':true
};

module.exports = config;
