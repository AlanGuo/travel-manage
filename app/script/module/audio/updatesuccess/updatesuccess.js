'use strict';

var $ = require('$'),
    template = require('template'),
    querystring = require('querystring'),
    CustomSideBarView = require('CustomSideBarView');

var RegionAddSuccessPageView = CustomSideBarView.extend({

    render: function () {
        var sidebar = $('#side-nav').length?undefined:template('sidebar',{active:'audio'});
        this.params = querystring.parse();
        this.renderContent({
            sidebar:sidebar,
            container:template('audio/addsuccess',{action:'更新',provinceId:this.params.provinceId,regionId:this.params.regionId})
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