'use strict';

var $ = require('$'),
    template = require('template'),
    request = require('request'),
    asyncRequest = require('asyncrequest'),
    binder = require('binder'),
    Dialog = require('Dialog'),
    CustomSideBarView = require('CustomSideBarView');

var ActivationManagePageView = CustomSideBarView.extend({

    pageSize: 10000,

    title:'激活管理',

    render: function () {
    	this.data = {
            provinceId:0,
            regionId:0,
            gridData:[]
        };
        var sidebar = $('#side-nav').length?undefined:template('sidebar',{active:'activation'});
        this.renderContent({
            sidebar:sidebar,
            container:template('activation/manage')
        });
        this.binderObject = binder.bind(this.$elem,this.data);

        this.$net.request({
            request:request.province,
            success:function(data){
                $('#province-select').html(template('region/provincelist',{provincelist:data}));
            }
        });

        this.$dialog = Dialog.create({$app:this.$app,$parent:this.$elem});
    },

    loadGrid:function(begin){
        var self = this;
        asyncRequest.all(this.$net,[{
            request:request.getAudio,
            params:{begin:begin, size:self.pageSize}
        }],
        function(data){
            self.data.gridData = data[0];
        });
    },

    events:{
        'click':{
        },
        'change':{
            'province':function(target){
                var self = this;
                $('#region-select').html(template('regionlist',{regionlist:[]}));
                this.$net.request({
                    request:request.getRegion,
                    data:{provinceId:target.value},
                    success:function(data){
                        self.data.provinceId = target.value;
                        $('#region-select').html(template('regionlist',{regionlist:data}));
                        self.data.gridData = [];
                    }
                });
            },
            'region':function(target){
                var self = this;
                if(target.value != '0'){
                    this.$net.request({
                        request:request.getAudio,
                        data:{regionId:target.value, begin:0, size:self.pageSize},
                        success:function(data){
                            self.data.regionId = target.value;
                            self.data.gridData = data;
                        }
                    });
                }
            }
        }
    },

    destroy:function(){
        this.$super();
        this.binderObject.unobserve();
    }
});
    
module.exports = ActivationManagePageView;