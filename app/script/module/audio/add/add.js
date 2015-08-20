'use strict';

var $ = require('$'),
    template = require('template'),
    request = require('request'),
    binder = require('binder'),
    querystring = require('querystring'),
    ErrorTips = require('ErrorTips'),
    CustomSideBarView = require('CustomSideBarView');

var AudioAddPageView = CustomSideBarView.extend({

    title:'新建语音',
    
    render: function () {
    	this.data = {
            audioSelected:false,
            audioData:'',
            formdata:{
                name:'',
                file:'',
                provinceId:0,
                latitude:'',
                longitude:'',
                audioFiles:[]
            }
        };

        this.params = querystring.parse();
        var sidebar = $('#side-nav').length?undefined:template('sidebar',{active:'audio'});
        this.renderContent({
            sidebar:sidebar,
            container:template('audio/add')
        });

        this.$errorTips = ErrorTips.create({$elem:$('#errortips')});
        this.binderObject = binder.bind(this.$elem,this.data);
    },

    prepare:function(){
        //这里检查输入的合法性
        var self = this;
        var formdata = new FormData();
        for(var p in this.data.formdata){
            if(/files/i.test(p)){
                if(this.data.formdata[p].length){
                    formdata.append(p,this.data.formdata[p][0]);
                }
            }
            else{
                formdata.append(p,this.data.formdata[p]);
            }
        }
        formdata.append('regionId',this.params.regionId);
        //更新数据
        this.$net.request({
            request:request.addAudio,
            data:formdata,
            success:function(result){
                if(!result.code){
                    location.href = '/?provinceId='+self.params.provinceId+'&regionId='+self.params.regionId+'#/audio/addsuccess';
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
            'uploadAudio':function(){
                $('#audio-file-choose').click();
            }
        },
        'change':{
            'audioChange':function(){
                this.data.audioSelected = true;
                this.data.formdata.file = '已选择';
            }
        }
    },

    destroy:function(){
        this.$super();
        this.binderObject.unobserve();
    }
});
    
module.exports = AudioAddPageView;