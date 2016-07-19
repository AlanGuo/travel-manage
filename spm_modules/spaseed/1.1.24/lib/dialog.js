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
 
var $ = require('$'),
	Node = require('Node'),
	Mask = require('Mask'),
	template = require('template');

var Dialog = Node.extend({
	ctor:function(data){
		data = data || {};
		data.className = data.className || '';
		this.$super(data);

		this.$parent = data.$parent;
		this.$mask = data.$mask === undefined ? Mask.create(data) : data.$mask;
		this.$app = data.$app;
		this.$event = this.$app.$event;
		this.hideoptions = data.hideoptions;

		//默认class
		this.$elem.addClass('dialog');
		this.$elem.html(template('dialog/dialog',data));
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
		if(this.isShowing) return;
		var self = this;
		options = options || {};
		this.isShowing = true;
		this.$elem.find('.cont-title').text(options.title || '');

		var prop = options.encode === false ?'html':'text';
		this.$elem.find('.text-content')[prop](content);

		if(options.buttons){
			this.$elem.find('.buttonpannel').html(template('dialog/buttonpannel',options));
		}
		else{
			this.$elem.find('.buttonpannel').hide();
		}

		if(options.hasCloseButton){
			this.$elem.find('.close-button').show();
		}
		else{
			this.$elem.find('.close-button').hide();
		}

		this.$mask && this.$mask.show();
		//有动画	
		this.$elem.show();

		//hide时候自动处理
		this.animateObject = options.animate;

		if(options.animate){
			if(options.animate.from){
				this.$elem.addClass(options.animate.from);
			}
			this.$elem.height();
			this.$elem.addClass(options.animate.to);

			setTimeout(function(){
				if(options.animate.end){
					options.animate.end();
				}

				self.isShowing = false;
			},options.animate.duration || 400);
		}
		else{
			this.isShowing = false;
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
		if(this.isHiding) return;
		var self = this;
		options = options || {};
		self.isHiding = true;
		var animateObject = options.animate || this.animateObject;

		if(animateObject){
			if(options.animate){
				this.$elem.addClass(animateObject.from);
				this.$elem.height();
				this.$elem.addClass(animateObject.to);
			}
			else{
				if(this.animateObject){
					//直接移除this.animate.to
					this.$elem.removeClass(animateObject.to);
				}
			}
			setTimeout(function(){
				if(animateObject.end){
					var result = options.animate.end();
					if(result !== false){
						self.$elem.hide();
						self.$mask && self.$mask.hide();

						self.$elem.removeClass(animateObject.from);
						self.$elem.removeClass(animateObject.to);
						self.$elem.removeClass(self.animateObject.from);
						self.$elem.removeClass(self.animateObject.to);
					}
				}
				else{
					self.$elem.hide();
					self.$mask && self.$mask.hide();

					self.$elem.removeClass(animateObject.from);
					self.$elem.removeClass(animateObject.to);
					self.$elem.removeClass(self.animateObject.from);
					self.$elem.removeClass(self.animateObject.to);
				}
				self.isHiding = false;
			},animateObject.duration || 400);
		}
		else{
			self.$elem.hide();
			self.$mask && self.$mask.hide();
			self.isHiding = false;
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