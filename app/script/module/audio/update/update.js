'use strict';

var $ = require('$'),
    template = require('template'),
    request = require('request'),
    binder = require('binder'),
    asyncRequest = require('asyncrequest'),
    querystring = require('querystring'),
    ErrorTips = require('ErrorTips'),
    CustomSideBarView = require('CustomSideBarView');

var AudioUpdatePageView = CustomSideBarView.extend({

    render: function () {
        var self = this;
        this.params = querystring.parse();
    	this.data = {
            audioSelected:true,
            audioData:'',
            formdata:{
                id:this.params.id,
                name:'',
                provinceId:0,
                latitude:'',
                longitude:'',
                file:'',
                audioFiles:[]
            }
        };
        var sidebar = $('#side-nav').length?undefined:template('sidebar',{active:'audio'});
        this.renderContent({
            sidebar:sidebar,
            container:template('audio/add')
        });

        asyncRequest.all(this.$net,[{
            request:request.getAudio,
            params:{id:this.params.id}
        },{
        	request:request.province
        }],
        function(data){
            //self.data.formdata = data[0][0];
            for(var p in data[0][0]){
                self.data.formdata[p] = data[0][0][p];
            }
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
        //更新数据
        this.$net.request({
            request:request.updateAudio,
            data:formdata,
            success:function(result){
                if(!result.code){
                    location.href = '/#/audio/updatesuccess';
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
                this.data.formdata.file = '已选择';
            }
        }
    },

    destroy:function(){
        this.$super();
        this.binderObject.unobserve();
    }
});
    
module.exports = AudioUpdatePageView;