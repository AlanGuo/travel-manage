'use strict';

var $ = require('$'),
    template = require('template'),
    request = require('request'),
    asyncRequest = require('asyncrequest'),
    binder = require('binder'),
    Dialog = require('Dialog'),
    CustomSideBarView = require('CustomSideBarView');

var RegionManagePageView = CustomSideBarView.extend({

    pageSize: 10000,

    title:'广告管理',

    render: function () {
    	this.data = {
            gridData:[]
        };
        var sidebar = $('#side-nav').length?undefined:template('sidebar',{active:'tips'});
        this.renderContent({
            sidebar:sidebar,
            container:template('tips/manage')
        });
        this.loadGrid(0,0,0);
        this.binderObject = binder.bind(this.$elem,this.data);

        this.$dialog = Dialog.create({$app:this.$app,$parent:this.$elem});
    },

    loadGrid:function(begin){
        var self = this;
        asyncRequest.all(this.$net,[{
            request:request.getRegion,
            params:{begin:begin, size:self.pageSize}
        }],
        function(data){
            for(var i=0;i<data[0].length;i++){
                data[0][i].clientId = i+1;
            }
            self.data.gridData = data[0];
        });
    },

    events:{
        'click':{
            'delete':function(target){
                this.deleteId = target.getAttribute('data-id');
                this.$dialog.show('确定要删除这个景区吗？',{
                    buttons:[{
                        text:'删除',
                        event:'doDelete'
                    },{
                        text:'取消'
                    }]
                });
            },
            'modify':function(target){
                window.location.href = '/?id='+target.getAttribute('data-id')+'#/region/update';
            },
            'doDelete':function(){
                if(this.deleteId){
                    var self = this;
                    this.$net.request({
                        request:request.deleteRegion,
                        data:{id:this.deleteId},
                        success:function(){
                            self.data.gridData = self.data.gridData.filter(function(item){
                                if(item.id!=self.deleteId){
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
            }
        }
    },

    destroy:function(){
        this.$super();
        this.binderObject.unobserve();
    }
});
    
module.exports = RegionManagePageView;