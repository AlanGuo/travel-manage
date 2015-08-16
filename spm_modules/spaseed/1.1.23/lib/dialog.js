'use strict';

/**
 * @dialog 模块
 * dialog.show(content,{
		buttons:[{
			text:'确定',
			event:'closeDialog'
		}]
 * });
 * 一个带通用头部和底部确定按钮的对话框
 * dialog.show(template)
 * 一个完全自定义的对话框
 * dialog.alert('文本');
 * 一个标准的提示对话框
 *
 * 目前只支持两个按钮
 */
 
var Node = require('Node'),
	Mask = require('Mask'),
	template = require('template');

var Dialog = Node.extend({
	ctor:function(data){
		data = data || {};
		data.className = '';
		this.$super(data);

		this.$parent = data.$parent;
		this.$mask = data.$mask || Mask.create(data);
		this.$app = data.$app;
		this.$event = this.$app.$event;
		this.hideoptions = data.hideoptions;

		//默认class
		this.$elem.addClass('dialog');
		this.$elem.html(template('dialog/dialog'));
		this.$elem.hide();

		if(this.$parent){
			//对话框元素
			var elem = this.$elem.length?this.$elem[0]:this.$elem;
			if(this.$parent.children().indexOf(elem)===-1){
				this.$parent.append(this.$elem);
			}
		}

		var self = this;
		this.$event.on(this,'click','hide',function(){
			self.hide(self.hideoptions);
		});

		this.__bodyhandler = {};
		this.__bodyhandler.click = this.$event.bindEvent(this, this.$elem, 'click');
	},
	show:function(content, options){
		options = options || {};

		this.$elem.find('.cont-title').text(options.title || '');

		var prop = options.encode === false ?'html':'text';
		this.$elem.find('.text-content')[prop](content);

		if(options.buttons){
			this.$elem.find('.buttonpannel').html(template('dialog/buttonpannel',options));
		}
		else{
			this.$elem.find('.buttonpannel').hide();
		}

		//有动画
		this.$elem.show();
		this.$mask.show();

		if(options.animate){
			this.$elem.show();
			this.$elem.height();
			this.$elem.addClass(options.animate);
		}
	},
	alert:function(content){
		this.show(content,{
			buttons:[{
				name:'确定',
			}]
		});
	},
	hide:function(options){
		var self = this;
		options = options || {};
		if(options.animate){
			this.$elem.addClass(options.animate);
			setTimeout(function(){
				self.$elem.hide();
				self.$mask.hide();
			},options.animateduration || 400);
		}
		else{
			self.$elem.hide();
			self.$mask.hide();
		}
	},
	//手动调用
	destroy:function(){
		//移除事件
		this.$event.off(this);

		for(var p in this.__bodyhandler){
			this.$event.unbindEvent(this.$elem, p, this.__bodyhandler[p]);
		}
	}
});

Dialog.create = function(data){
	return new Dialog(data);
};

module.exports = Dialog;