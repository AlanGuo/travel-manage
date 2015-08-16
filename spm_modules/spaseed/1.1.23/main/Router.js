'use strict';

var $ = require('$'),
	mp = require('mp');

var Router = mp.Class.extend({
	view:null,
	history:[],
	historyIndex:0,
	ctor:function(app){
		this.$app = app;
	},

	/*重载*/
	init:function(){},

	loadUrl:function(path,option,cacheHtml,effect){
		//数据校验
		if(!path){
			this.loadUrl(this.$app.config.root,option,cacheHtml,effect);
			return;
		}
		//配置
		if(!option){
			option = {};
		}

		if(cacheHtml){
			option.cacheHtml = cacheHtml;
		}

		if(effect){
			option.effect = effect;
		}

		var obj = this._parse.call(this,path,option),view;

		//当前view修改参数，不重新渲染，执行view的reload方法
		//_ 记录了当前view的id
		if(this.view && this.view._ === obj.view){
			view = this.view;
			view.params = obj.params;
			view.reload();
		}
		//否则重新构建view
		else{
			var self = this;
			require.async(obj.view,function(View){
				if(View){
					view = new View({$app:self.$app});
					view._ = obj.view;
					view.params = obj.params;
					self.loadView(view);
					self.push(location.href,option,view);
				}
				else{
					self.render404();
				}
			});
		}
	},

	render404:function(){
		this.$app.$elem.html(this.$app.config.html404);
	},

	back:function(record){
		var record = this.pop();
		if(record){
			this.loadUrl.apply(this,record);
		}
	},

	addChild:function(view){
		this.$super(view);
	},

	loadView:function(view){
		if(this.view){
			this.view.destroy();
		}
		if(this.isNew){
			this.addChild(view);
		}
		this.view = view;
		this.view.render();
		//设置标题
		document.title = this.view.title || this.$app.config.title;
	},

	_parse:function(url, option){
		var atag,pathname,search,params = {},view,arr,pair,filename;
		atag = document.createElement('a');
		atag.href = url;

		pathname = atag.pathname;
		search = atag.search.substr(1);

		if(pathname == '/'){
			pathname = this.$app.config.root || '/index';
		}

		//文件名和最后一个文件夹相同
		filename = pathname.split('/').slice(-1);
		view = this.$app.config.viewfolder + pathname + '/' + filename;

		for(var p in option){
			params[p] = option[p];
		}
		arr = search.split('&');
		arr.forEach(function(item){
			pair = item.split('=')
			if(pair[0]){
				params[pair[0]] = pair[1];
			}
		});

		return {
			pathname:pathname,
			view:view,
			params:params,
			template:pathname.substr(1)
		};
	},
	/*重载*/
	push:function(){},
	/*重载*/
	pop:function(){},
	/*重载*/
	launch:function(){}
});

Router.create = function(app){
	return new Router(app);
}

module.exports = Router;
