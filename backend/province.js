var mysql = require('mysql'),
	util = require('./util'),
	admin = require('./admin'),
	connection = require('./connection');

var province = {
	///province/list
	list : function(pathname,req,res,config){
		if(!admin.checklogin(req)){
			util.jsonRespond(res,{
				code:403,
				data:{},
				msg:'no login'
			},{
				status:403
			});
			return;
		}
		if(/get/i.test(req.method)){
			connection.pool.getConnection(function(err, connection){
				if(err){
					console.log(err);
					util.jsonRespond(res,{
						code:501,
						data:{},
						msg:'get connection failed'
					},{
						status:500
					});
				}
				else{
					var columns = [
						'id',
						'name'
					];
					var sql = mysql.format('select ?? from traveldb.province',[columns]);
					connection.query(sql,function(err, rows){
						connection.release();
						if(!err){
							util.jsonRespond(res,{
								code:0,
								data:rows,
								msg:''
							});
						}
						else{
							console.log(err);
							util.jsonRespond(res,{
								code:502,
								data:{},
								msg:'query region failed'
							},{
								status:500
							});
						}
					});
				}
			});
		}
		else{
			util.jsonRespond(res,{
				code:405,
				data:{},
				msg:'method not allowed'
			},{
				status:405
			});
		}
	}
}

module.exports = province;