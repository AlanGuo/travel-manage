'use strict';

var cache = {};

/**
 * 数据管理
 * @class dataManager
 * @static
 */
var dataManager = {

	/**
	 * 获取缓存数据
	 * @method get
	 * @param {String} name 名称
	 * @return 缓存数据
	 */
	get: function (name) {
		return cache[name];
	},

	/**
	 * 设置缓存数据
	 * @method set
	 * @param {String} name 名称
	 * @param value 值
	 */
	set: function (name, value) {
		cache[name] = value;
	},

	/**
	 * 获取所有缓存数据
	 * @method getCache
	 * @return cache 缓存对象
	 */
	getCache: function () {
		return cache;
	},

	/**
	 * 清除所有缓存数据
	 * @method clearCache
	 */
	clearCache: function () {
		cache = {};
	}
};

module.exports = dataManager;
