'use strict';

var $ = require('$'),
    template = require('template'),
    request = require('request'),
    asyncRequest = require('asyncrequest'),
    binder = require('binder'),
    Dialog = require('Dialog'),
    CustomSideBarView = require('CustomSideBarView');

var AudioManagePageView = CustomSideBarView.extend({

    pageSize: 10000,

    title:'语音管理',

    render: function () {
    	this.data = {
            provinceId:0,
            regionId:0,
            gridData:[]
        };
        var sidebar = $('#side-nav').length?undefined:template('sidebar',{active:'audio'});
        this.renderContent({
            sidebar:sidebar,
            container:template('audio/manage')
        });
        this.binderObject = binder.bind(this.$elem,this.data);

        this.$net.request({
            request:request.province,
            success:function(data){
                $('#province-select').html(template('provincelist',{provincelist:data}));
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
            'delete':function(target){
                this.deleteId = target.getAttribute('data-id');
                this.$dialog.show('确定要删除这个语音吗？',{
                    buttons:[{
                        text:'删除',
                        event:'doDelete'
                    },{
                        text:'取消'
                    }]
                });
            },
            'modify':function(target){
                window.location.href = '/?id='+target.getAttribute('data-id')+'#/audio/update';
            },
            'doDelete':function(){
                if(this.deleteId){
                    var self = this;
                    this.$net.request({
                        request:request.deleteAudio,
                        data:{id:this.deleteId},
                        success:function(){
                            self.data.gridData = self.data.gridData.filter(function(item){
                                if(item.id != self.deleteId){
                                    return item;
                                }
                            });
                            self.$dialog.hide();
                        },
                        error:function(){
                            self.$dialog.alert('删除失败');
                        }
                    });
                }
            },
            'addAudio':function(){
                if(this.data.regionId != '0'){
                    location.href = '/?regionId='+this.data.regionId+'#/audio/add';
                }
                
            }
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
    
module.exports = AudioManagePageView;