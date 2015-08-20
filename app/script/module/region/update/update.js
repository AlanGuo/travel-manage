'use strict';

var $ = require('$'),
    template = require('template'),
    request = require('request'),
    binder = require('binder'),
    asyncRequest = require('asyncrequest'),
    querystring = require('querystring'),
    ErrorTips = require('ErrorTips'),
    CustomSideBarView = require('CustomSideBarView');

var RegionUpdatePageView = CustomSideBarView.extend({

    render: function () {
        var self = this;
        this.params = querystring.parse();
    	this.data = {
            coverSelected:false,
            coverData:'',
            bannerData:'',
            bannerSelected:false,
            formdata:{
            	id:this.params.id,
                name:'',
                provinceId:0,
                latitude:'',
                longitude:''
            }
        };
        var sidebar = $('#side-nav').length?undefined:template('sidebar',{active:'region'});
        this.renderContent({
            sidebar:sidebar,
            container:template('region/add',{active:'更新'})
        });

        asyncRequest.all(this.$net,[{
            request:request.getRegion,
            params:{id:this.params.id}
        },{
        	request:request.province
        }],
        function(data){
            //self.data.formdata = data[0][0];
            self.data.formdata.name = data[0][0].name;
            self.data.formdata.provinceId = data[0][0].provinceId;
            self.data.formdata.latitude = data[0][0].latitude;
            self.data.formdata.longitude = data[0][0].longitude;
            $('#province-select').html(template('provincelist',{provincelist:data[1]}));
        });

        this.$errorTips = ErrorTips.create({$elem:$('#errortips')});
        this.binderObject = binder.bind(this.$elem,this.data);
    },

    prepare:function(){
        //这里检查输入的合法性
        this.data.formdata.name = this.data.formdata.name.trim();
        var self = this;
        //更新数据
        this.$net.request({
            request:request.updateRegion,
            data:this.data.formdata,
            success:function(result){
                if(!result.code){
                    location.href = '/#/region/updatesuccess';
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
    
module.exports = RegionUpdatePageView;