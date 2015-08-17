'use strict';

var $ = require('$'),
    template = require('template'),
    CustomSideBarView = require('CustomSideBarView');

var RegionAddSuccessPageView = CustomSideBarView.extend({

    render: function () {
        var sidebar = $('#side-nav').length?undefined:template('sidebar',{active:'manage'});
        this.renderContent({
            sidebar:sidebar,
            container:template('region/addsuccess')
        });
    },

    events:{
        'click':{
            'continue':function(){

            },
            'returnToList':function(){

            }
        }
    },

    destroy:function(){
    }
});
    
module.exports = RegionAddSuccessPageView;