'use strict';

var $ = require('$'),
    template = require('template'),
    CustomSideBarView = require('CustomSideBarView');

var RegionUpdateSuccessPageView = CustomSideBarView.extend({

    render: function () {
        var sidebar = $('#side-nav').length?undefined:template('sidebar',{active:'audio'});
        this.renderContent({
            sidebar:sidebar,
            container:template('audio/addsuccess',{action:'更新'})
        });
    }
});
    
module.exports = RegionUpdateSuccessPageView;