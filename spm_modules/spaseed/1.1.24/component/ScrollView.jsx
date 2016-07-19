

module.exports = React.createClass(
{
    getInitialState: function() {
        return {};
    },
    componentDidMount:function(){
        ThisApp.emit('nobounce',{Node:React.findDOMNode(this)});
    },
    render: function() {
        return (
            <div className="content" style={this.props.style} data-scroll="down,up">
                {
        		this.props.children
                }
        	</div>
        );
    }
});

