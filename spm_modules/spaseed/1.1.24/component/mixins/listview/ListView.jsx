
var List = require('Mixin.List')
module.exports = React.createClass(
{
    mixins:[List],
    render: function() {

        var ListViewRow = this.props.ListViewRow;

    	return (
            <ul className="table-view">
            {
                this.state.loading?
                <h3 className="title">
                    <span className="icon-refresh"></span>
                </h3> :
                false
            }
            {
                
                this.state.items.map(function(row){
                    return <ListViewRow key={row.id} {...row} />
                }.bind(this))
               
            }
            </ul> 
        );
    }
});

