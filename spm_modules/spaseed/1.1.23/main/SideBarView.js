'use strict';

/**
 * SideBarView
 * sidebarId
 * sidebarTemplate
 * sidebarData
 * containerId
 */

var $ = require('$'),
	View = require('View'),
	MenuView = require('MenuView'),
	template = require('template');

var SideBarView = View.extend({
	$elem:$('#wrapper-all'),
	/*其他控制元素*/
	elements:{},

	ctor:function(data){
		this.$super(data);
		this.renderTemplate(data);
		data.$elem = this.elements.$sidebar;
		//menuview控制
		this.$menu = new MenuView(data);
	},

	renderTemplate:function(data){
		var sidebar = $(data.sidebarId || '#sidebar'),
			container = $(data.containerId || '#container');

		if(!sidebar.length || !container.length){
			this.$elem.html(template(data.sidebarTemplate ||'sidebartemplate',data.sidebarData));
			this.elements.$sidebar = $(data.sidebarId || '#sidebar');
			this.elements.$container = $(data.containerId || '#container');
		}
		else{
			this.elements.$sidebar = sidebar;
			this.elements.$container = container;
		}
	},

	renderContent:function(option){
		if(option.container !== undefined){
			this.elements.$container.html(option.container);
		}
		if(option.sidebar !== undefined){
			this.elements.$sidebar.html(option.sidebar);
		}
		this.$menu.render();
	},

	/*重载*/
	render:function(){
	},
	/*重载*/
	reload:function(){
	},
	/*重载*/
	destroy:function(){
		//移除事件
		this.$super();
	}
})

module.exports = SideBarView;
