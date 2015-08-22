'use strict';

var template = require('template'),
	request = require('request'),
    CustomSideBarView = require('CustomSideBarView');

var indexPageView = CustomSideBarView.extend({

    render: function (){
        this.renderContent({
            sidebar:template('sidebar'),
            container:template('index')
        });

        this.$net.request({
            request:request.getRegion,
            params:{begin:0, size:1}
        });
    }
});
    
module.exports = indexPageView;