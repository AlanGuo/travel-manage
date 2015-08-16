
var TabBar = require('TabBar');
var Header = require("Header");
var ScrollView = require('ScrollView');

module.exports = React.createClass(
{
    render: function() {
    	return (
    		<div>
    			<Header {...this.props.header} />
                {
                    this.props.scrollView.defaultScroll? <ScrollView {...this.props.scrollView}>{this.props.$}</ScrollView>:this.props.$
                }
		        
				<TabBar {...this.props.tabBar} />
			</div>
		);
    }
});

