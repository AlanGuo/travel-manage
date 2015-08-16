
module.exports = React.createClass(
{
    render: function() {

    	return (
    		<div className="slider">
			  <div className="slide-group">
			  	{
			  		this.props.items.map(function(item){
		                return <SliderItem {...item} />;
		    		}.bind(this))
			  	}
			  </div>
			</div>
    	);
    }
});

