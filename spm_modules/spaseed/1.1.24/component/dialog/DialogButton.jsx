'use strict';

define(function (require, exports, module) {

	module.exports = React.createClass({
	    render: function(){
        	return (
	        	<a className={this.props.primary?'btn btn-0':'btn'}>{this.props.children||'确定'}</a>
            );
	    }
	});

});

