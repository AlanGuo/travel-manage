'use strict';

var template = require('template'),
    CustomSideBarView = require('CustomSideBarView');

var indexPageView = CustomSideBarView.extend({

    render: function (){
        this.renderContent({
            sidebar:template('sidebar'),
            container:template('index')
        });
    }
});
    
module.exports = indexPageView;