'use strict';

var $ = require('$'),
    View = require('View'),
    ErrorTips = require('ErrorTips'),
    template = require('template'),
    binder = require('binder'),
    request = require('request'),
    formatchecker = require('formatcheck');

var signinpageView = View.extend({

    $elem:$('#wrapper-all'),

    ctor:function(data){
        data.className = 'login-wrapper';
        this.$super(data);
        document.domain = 'xunlei.com';
    },

    title:'登录',

    render: function () {
        this.data = {
            postedData:{
                login:'',
                userpassword:'',
                vercode:''
            }
        };
        this.$elem.html(template('account/signin'));
        this.$errorTips = ErrorTips.create({$elem:$('#errortips')});
        this.binderObject = binder.bind(this.$elem,this.data);

        if(xlQuickLogin.isLogined()){
            location.href = '#/index';
        }
        else{
            xlQuickLogin.popup();
        }
    },

    events:{
        'click':{
            'signin':function(){
                var self = this;
                var postedData = this.data.postedData;
                for(var p in postedData){
                    postedData[p] = postedData[p].trim();
                }

                if(!formatchecker.isEmail(postedData.login) && !formatchecker.isMobile(postedData.login)){
                    self.$errorTips.show('请填写正确的email或者手机号码');
                    return;
                }                 
                if(!formatchecker.isPassword(postedData.userpassword)){
                    self.$errorTips.show('请填写正确的密码');
                    return;
                }
                // if(!formatchecker.notEmpty(postedData.vercode)){
                //     self.$errorTips.show('请填写验证码');
                //     return;
                // }

                //登陆
                this.$net.request({
                    request:request.signin,
                    data:postedData,
                    success:function(){
                        location.href = '#/index';
                    },
                    error:function(msg){
                        //self.data.src = vercode + '?random=' + Math.random();
                        self.$errorTips.show(msg);
                    }
                });
            },
            'changevercode':function(){
                //this.data.src = vercode + '?random=' + Math.random();
            },
            'forgetpassword':function(){

            },
            'resetpassword':function(){

            }
        }
    },

    destroy: function () {
        this.binderObject.unobserve();
    }
});
    
module.exports = signinpageView;