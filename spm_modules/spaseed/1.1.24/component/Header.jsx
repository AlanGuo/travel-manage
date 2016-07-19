

module.exports = React.createClass(
{
    //title leftButton  rightButton navBar
    render: function() {
    	return (	
        	<header className={"bar bar-nav"}>
        		<button className="btn btn-link btn-nav pull-left" data-click="back">
			    	<span className={"icon icon-"+this.props.button.left}></span>	
			 	</button>
				<button className="btn btn-link btn-nav pull-right">
					<span className={"icon icon-"+this.props.button.right}></span>
			 	</button>
				{this.props.navBar?this.props.navBar:(<h1 className="title">{this.props.title}</h1>)}
			</header>
		);
    }
});

