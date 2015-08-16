
var ControlItem = require('ControlItem')
var ScrollView = require('ScrollView');

module.exports = React.createClass(
{
    getInitialState: function() {

    	var active = '';
    	
    	this.props.children.forEach(function(child){
    		if(child.props.active){
    			active = child.props.text;
    		}
    	})
        return {
            active:active
        };
    },
    onTouchStart:function(event){
    	this.setState({active:event.target.text})
    },
    render: function() {
    	return (
    		<div>
	    		<div className="segmented-control" style={{top:'43px',zIndex:'999'}}>
		    		{
			    		this.props.children.map(function(child,i){
			    			var classes = React.addons.classSet({
								'control-item': true,
								'active': this.state.active == child.props.text
							});
			    			return <a key={i} onTouchStart={this.onTouchStart} className={classes}>{child.props.text}</a>
			    		}.bind(this))
		    		}
		    	</div>
		    	<ScrollView style={{paddingTop:'68px',paddingBottom: '34px'}}>
		    	{

		    		this.props.children.map(function(child,i){
		    			var classes = React.addons.classSet({
							'control-content': true,
							'active': this.state.active == child.props.text
						});
		    			return <span  key={i}  className={classes}>{child}</span>
		    		}.bind(this))
		    	}
		    	</ScrollView>
	    	</div>
	    );
    }
});

