'use strict';

var $ = require('$'),
    template = require('template'),
    request = require('request'),
    binder = require('binder'),
    ErrorTips = require('ErrorTips'),
    CustomSideBarView = require('CustomSideBarView');

var RegionAddPageView = CustomSideBarView.extend({

    render: function () {
        var self = this;
    	this.data = {
            coverSelected:false,
            coverData:'',
            bannerData:'',
            bannerSelected:false,
            formdata:{
                name:'',
                provinceId:0,
                latitude:'',
                longitude:''
            }
        };
        var sidebar = $('#side-nav').length?undefined:template('sidebar',{active:'region'});
        this.renderContent({
            sidebar:sidebar,
            container:template('region/add',{active:'新建'})
        });

        //拉取地域
        this.$net.request({
            request:request.province,
            success:function(data){
                $('#province-select').html(template('provincelist',{provincelist:data}));
            },
            error:function(msg){
                self.$errorTips.show(msg);
            }
        });

        this.$errorTips = ErrorTips.create({$elem:$('#errortips')});
        this.binderObject = binder.bind(this.$elem,this.data);
    },

    prepare:function(){
        this.data.formdata.name = this.data.formdata.name.trim();
        //这里检查输入的合法性
        var self = this;
        //更新数据
        this.$net.request({
            request:request.addRegion,
            data:this.data.formdata,
            success:function(result){
                if(!result.code){
                    location.href = '/#/region/addsuccess';
                }
            },
            error:function(msg){
                self.$errorTips.show(msg);
            }
        });
    },

    events:{
        'click':{
            'save':function(){
                this.prepare();
            },
        }
    },

    destroy:function(){
        this.$super();
        this.binderObject.unobserve();
    }
});
    
module.exports = RegionAddPageView;