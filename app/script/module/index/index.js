'use strict';

define(function (require, exports, module) {
    var template = require('template'),
        cookie = require('cookie'),
        CustomSideBarView = require('CustomSideBarView');

    var indexPageView = CustomSideBarView.extend({

        render: function (){
            this.renderContent({
                sidebar:template('sidebar'),
                container:template('index')
            });
        },
        events:{
            'click':{
                'signout':function(){
                    cookie['delete']('uin');
                    cookie['delete']('skey');

                    location.href = '/#/account/signin';
                }
            }
        }
    });
        
    module.exports = indexPageView;
});