
var TabBarItem = require('TabBarItem');

module.exports = React.createClass(
{
    render: function() {

    	return <nav className="bar bar-tab" style={this.props.style}>
    	{
    		this.props.columns.map(function(column){
                return <TabBarItem key={column.id} {...column}/>;
    		}.bind(this))
    	}
    	</nav>;
    }
});

