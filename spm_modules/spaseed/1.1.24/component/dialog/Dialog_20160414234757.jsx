'use strict';

var DialogButton = require('DialogButton');
module.exports = React.createClass({
	hide:function(){
		React.findDOMNode(this.refs.dialog).style.display = 'none';
	},
	show:function(){
		React.findDOMNode(this.refs.dialog).style.display = '';
	},
    render: function(){
    	return (
    		<div className='dialog' ref='dialog'>
	            <div className='cont-title'>
	            	{this.props.title}
				</div>
				<div className='cont-wrapper'>
					<div className='text-content'>{this.props.text}</div>
				</div>
				<div className='buttonpannel'>
					{
						this.props.buttons.map(function(child,i){
							if(this.props.buttons.length>1 && i==0){
								return <DialogButton primary onClick={this.hide}>{child}</DialogButton>;
							}
							else{
								return <DialogButton onClick={this.hide}>{child}</DialogButton>;
							}
						}.bind(this))
					}
				</div>
			</div>
        );
    }
});

