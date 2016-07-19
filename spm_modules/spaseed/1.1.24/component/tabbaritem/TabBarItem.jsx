
module.exports = React.createClass(
{
    onTouchStart:function(event){
        ThisApp.emit('router',{router:this.props.router});
    },
    render: function() {
		   return (
      		<a 
      			className={"tab-item "+(this.props.active?'active':'')} 
      			onTouchStart={this.onTouchStart}
      		>
  				 <span className={"icon icon-"+this.props.icon}></span>
  				 <span className="tab-label">{this.props.name}</span>
			   </a>
	     )
    }
});

