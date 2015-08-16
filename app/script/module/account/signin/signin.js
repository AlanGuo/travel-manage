'use strict';

define(function (require, exports, module) {
    var $ = require('$'),
        View = require('View'),
        ErrorTips = require('ErrorTips'),
        template = require('template'),
        binder = require('binder'),
        request = require('request'),
        formatchecker = require('formatcheck'),
        vercode = '/cgi-bin/security/verifycode';

    var signinpageView = View.extend({

        $elem:$('#wrapper-all'),

        ctor:function(data){
            data.className = 'login-wrapper';
            this.$super(data);
        },

        title:'登录',

        binderObject:null,

        data:{
            postedData:{
                login:'',
                userpassword:'',
                vercode:''
            },
            src:vercode
        },

        render: function () {
            this.$elem.html(template('account/signin'));
            this.$errorTips = ErrorTips.create({$elem:$('#errortips')});
            this.binderObject = binder.bind(this.$elem,this.data);
        },

        reload:function(){
            this.data.postedData.userpassword = '';
            this.data.postedData.vercode = '';
            this.data.src = vercode + '?random=' + Math.random();
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
                    if(!formatchecker.notEmpty(postedData.vercode)){
                        self.$errorTips.show('请填写验证码');
                        return;
                    }

                    //登陆
                    this.$net.request({
                        request:request.signin,
                        data:postedData,
                        success:function(){
                            location.href = '#/index';
                        },
                        error:function(msg){
                            self.data.src = vercode + '?random=' + Math.random();
                            self.$errorTips.show(msg);
                        }
                    });
                },
                'changevercode':function(){
                    this.data.src = vercode + '?random=' + Math.random();
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
});