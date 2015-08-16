'use strict';

var env = {},ua = navigator.userAgent;

env.title = 'spaseed';
env.isAndroid = /android/i.test(ua);
env.isIOS = /iPod|iPad|iPhone/i.test(ua);
env.isMobile = env.isAndroid || env.isIOS;
env.isWX = /micromessenger/i.test(ua);
env.isMQQB = /mqqbrowser/i.test(ua);
//env.appid = 'wx';

var doc = document.documentElement;
var bod = document.body;
env.resolution = {};
env.resolution.x = Math.max(doc.clientWidth,bod.clientWidth);
env.resolution.y = Math.max(doc.clientHeight,bod.clientHeight);

module.exports = env;