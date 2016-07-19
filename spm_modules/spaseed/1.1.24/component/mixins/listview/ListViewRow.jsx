
module.exports = React.createClass(
{
    render: function() {
        return (  	
            <li className="table-view-cell" onClick={this.onClickItem}  data-effect="left"  data-click="router" data-router={this.props.router}>
                <a className="navigate-right translate3d" data-scroll="left,right">
			      {this.props.text}
			      <div className="drawer">
			        删除
			      </div>
			    </a>
            </li>
        )       
    }
});
