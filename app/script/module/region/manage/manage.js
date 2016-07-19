'use strict';

var $ = require('$'),
    template = require('template'),
    request = require('request'),
    cookie = require('cookie'),
    //asyncRequest = require('asyncrequest'),
    binder = require('binder'),
    ErrorTips = require('ErrorTips'),
    Dialog = require('Dialog'),
    CustomSideBarView = require('CustomSideBarView');

var RegionManagePageView = CustomSideBarView.extend({

    pageSize: 10000,

    title:'推送管理',

    render: function () {

    	this.data = {
            gridData:[]
        };
        var sidebar = $('#side-nav').length?undefined:template('sidebar',{active:'region'});
        this.renderContent({
            sidebar:sidebar,
            container:template('region/manage')
        });
        this.loadData();
        this.binderObject = binder.bind(this.$elem,this.data);

        this.$errorTips = ErrorTips.create({$elem:$('#errortips')});
        this.$dialog = Dialog.create({$app:this.$app,$parent:this.$elem});
    },

    loadData:function(){
        var self = this;
        this.$net.request({
            request:request.querydevice,
            data:{
                userid:cookie.get('userid'),
                cookie:document.cookie
            },
            success:function(data){
                console.log(data);
                var gridData = [];
                for(var i=0;i<data.devices.length;i++){
                    var device = data.devices[i];
                    var deviceData = {
                        id:i+1,
                        regionName:'广东深圳',
                        name:decodeURIComponent(device.aliasname) || device.serverip,
                        pid:device.pid,
                        checked:false,
                        status:''
                    };
                    gridData.push(deviceData);
                }
                self.data.gridData = gridData;                  
            },
            error:function(){ 
            }
        });

        this.data.files = null;
        this.data.uploadPercentString = '0%';
        
        this.data.pushEnabled =  false;
        this.data.fileUrl = null;
    },

    events:{
        'click':{
            'clickall':function(target){
                this.data.gridData.map(function(item){
                    item.checked = target.checked;
                });

                if(this.data.fileUrl){
                    this.data.pushEnabled = this.data.gridData.some(function(item){
                        return item.checked === true;
                    });
                }

                return true;
            },
            'checkone':function(){
                var self = this;
                if(self.data.fileUrl){
                    setTimeout(function(){
                        self.data.pushEnabled = self.data.gridData.some(function(item){
                            return item.checked === true;
                        });
                    });
                }
                
                return true;
            },
            'push':function(target){
                var self = this;
                if(!$(target).hasClass('disabled')){
                    self.data.gridData.forEach(function(item){
                        if(item.checked){
                            self.$net.request({
                                request:request.push,
                                data:{
                                    pid:item.pid,
                                    cookie:document.cookie,
                                    task:self.data.fileUrl
                                },
                                success:function(){
                                    item.status = '任务创建成功';                           
                                },
                                error:function(){
                                    //self.$errorTips.show(msg);
                                    item.status = '任务创建失败';  
                                }
                            });
                        }
                    });
                }
            },
            'upload':function(){
                if(this.data.files && this.data.files.length){

                    var self = this;
                    var formdata = new FormData();

                    //for(let i=0;i<this.data.files.length;i++){
                    formdata.append('file',this.data.files[0]);
                    //}
                    
                    self.$elem.find('#upload-button').hide();
                    self.$elem.find('#progress-bar').show();

                    this.$net.request({
                        request:request.uploadfile,
                        data:formdata,
                        success:function(result){
                            self.$elem.find('#upload-button').hide();
                            self.$elem.find('#progress-bar').hide();
                            self.$elem.find('#upoad-success').show();
                            self.$elem.find('#server-process').hide();

                            self.data.fileUrl = result.url;                            
                        },
                        uploadProgress:function(evt){
                            var loaded = evt.loaded;
                            var tot = evt.total;
                            var per = Math.floor(100 * loaded / tot);
                            self.data.uploadPercentString = per+'%';

                            if(per >= 100){
                                self.$elem.find('#upload-button').hide();
                                self.$elem.find('#progress-bar').hide();
                                self.$elem.find('#upoad-success').hide();
                                self.$elem.find('#server-process').show();
                            }
                        },
                        error:function(msg){
                            self.$errorTips.show(msg);

                            self.$elem.find('#upload-button').show();
                            self.$elem.find('#progress-bar').hide();
                            self.$elem.find('#upoad-success').hide();
                            self.$elem.find('#server-process').hide();

                            self.data.fileUrl = null;
                        },
                        button:$('.btn-confirm')[0]
                    });
                }
            },
            newfile:function(){
                var self = this;
                self.$elem.find('#upload-button').show();
                self.$elem.find('#progress-bar').hide();
                self.$elem.find('#upoad-success').hide();
                self.$elem.find('#server-process').hide();
                self.data.files = null;
                self.data.fileUrl = null;

                this.data.gridData.forEach(function(item){
                    item.status = '';
                });
            }
        }
    },

    destroy:function(){
        this.$super();
        //this.binderObject.unobserve();
    }
});
    
module.exports = RegionManagePageView;