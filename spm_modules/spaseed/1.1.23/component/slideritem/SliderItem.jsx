
module.exports = React.createClass(
{
    render: function() {
        return (
            <div className="slide">
              <Image {...imageSource} />
		      <span className="slide-text">
		        <span className="icon icon-left-nav"></span>
		        {this.props.text}
		      </span>
		    </div>
        );       
    }
});
