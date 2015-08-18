'use strict';

var $ = require('$'),
    template = require('template'),
    CustomSideBarView = require('CustomSideBarView');

var RegionAddSuccessPageView = CustomSideBarView.extend({

    render: function () {
        var sidebar = $('#side-nav').length?undefined:template('sidebar',{active:'audio'});
        this.renderContent({
            sidebar:sidebar,
            container:template('audio/addsuccess',{action:'新增'})
        });
    },

    events:{
        'click':{
            'continue':function(){

            },
            'returnToList':function(){

            }
        }
    }
});
    
module.exports = RegionAddSuccessPageView;