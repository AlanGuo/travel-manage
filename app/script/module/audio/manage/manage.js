'use strict';

var $ = require('$'),
    template = require('template'),
    request = require('request'),
    asyncRequest = require('asyncrequest'),
    querystring = require('querystring'),
    binder = require('binder'),
    Dialog = require('Dialog'),
    CustomSideBarView = require('CustomSideBarView');

var AudioManagePageView = CustomSideBarView.extend({

    pageSize: 10000,

    title:'语音管理',

    render: function () {
        var self = this;
    	this.data = {
            gridData:[]
        };
        this.params = querystring.parse();
        var sidebar = $('#side-nav').length?undefined:template('sidebar',{active:'audio'});
        this.renderContent({
            sidebar:sidebar,
            container:template('audio/manage')
        });
        this.binderObject = binder.bind(this.$elem,this.data);

        this.$net.request({
            request:request.province,
            success:function(data){
                self.$provinceSelect.html(template('provincelist',{provincelist:data}));
                if(self.params.provinceId){
                    self.$provinceSelect[0].value = self.params.provinceId;

                    self.$regionSelect.html(template('regionlist',{regionlist:[]}));
                    self.$net.request({
                        request:request.getRegion,
                        data:{provinceId:self.params.provinceId},
                        success:function(data){
                            self.$regionSelect.html(template('regionlist',{regionlist:data}));

                            if(self.params.regionId){
                                self.$regionSelect[0].value = self.params.regionId;
                                self.$net.request({
                                    request:request.getAudio,
                                    data:{regionId:self.params.regionId, begin:0, size:self.pageSize},
                                    success:function(data){
                                        self.data.gridData = data;
                                    }
                                });
                            }
                            else{
                                self.data.gridData = [];
                            }
                            
                        }
                    });
                }
            }
        });

        this.$dialog = Dialog.create({$app:this.$app,$parent:this.$elem});
        this.$provinceSelect = $('#province-select');
        this.$regionSelect = $('#region-select');
    },

    loadGrid:function(begin){
        var self = this;
        asyncRequest.all(this.$net,[{
            request:request.getAudio,
            params:{regionId:this.params.regionId, begin:begin, size:self.pageSize}
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
                window.location.href = '/?provinceId='+this.params.provinceId+'&regionId='+this.params.regionId+'&id='+target.getAttribute('data-id')+'#/audio/update';
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
                if(this.params.regionId != '0'){
                    location.href = '/?provinceId='+this.params.provinceId+'&regionId='+this.params.regionId+'#/audio/add';
                }
                
            }
        },
        'change':{
            'province':function(target){
                location.href = '/?provinceId='+target.value+(this.params.regionId?('&regionId='+this.params.regionId):'')+'#/audio/manage';
            },
            'region':function(target){
                location.href = (this.params.provinceId?('/?provinceId='+this.params.provinceId):'')+'&regionId='+target.value+'#/audio/manage';
            }
        }
    },

    destroy:function(){
        this.$super();
        this.binderObject.unobserve();
    }
});
    
module.exports = AudioManagePageView;