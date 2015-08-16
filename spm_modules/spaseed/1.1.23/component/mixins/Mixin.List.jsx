
var SetInterval = require('Mixin.SetInterval')
var Ajax = require('Mixin.Ajax');
module.exports = {
  mixins:[SetInterval,Ajax],
    getInitialState: function() {
        return {
            items:[],
            loading:true
        };
    },
    componentDidMount:function () {
    	this.get(this.props.dataSource,function(ret){
            var list = ret.data.map(function(item){
                item.router = "/trend/thread";
                return item;
            })
    		this.setState({items:ret.data,loading:false})
    	})
    },
    componentDidUpdate:function(){
        ThisApp.emit('nobounce',{update:true});
    }
};