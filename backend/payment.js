var connection = require('./connection'),
	util = require('./util'),
	mysql = require('mysql'),
	path = require('path'),
	qs = require('querystring'),
	bodyParser = require('body-parser'),
	admin = require('./admin'),
	crypto = require('crypto'),
	multiparty = require('multiparty'),
	fs = require('fs');

var payment ={
	'get':function(pathname, request, response, config){
		if(!admin.checklogin(request)){
			util.jsonRespond(response,{
				code:403,
				data:{},
				msg:'no login'
			},{
				status:403
			});
			return;
		}
		if(/get/i.test(request.method)){
			var query = qs.parse(request.parsedUrl.query);
			connection.pool.getConnection(function(err, connection){
				if(err){
					console.log(err);
					util.jsonRespond(response,{
						code:501,
						data:{},
						msg:'get connection failed'
					},{
						status:500
					});
				}
				else{
					var sql = '';
					if(query.id){
						sql = mysql.format('select * from traveldb.payment where id=?',[
							query.id
						]);
					}
					else if(query.regionId){
						sql = mysql.format('select * from traveldb.payment join traveldb.user on traveldb.payment.userId=traveldb.user.id where traveldb.payment.regionId=? order by traveldb.payment.id limit ?,?',[
							query.regionId,
							query.begin*1 || 0,
							query.size*1 || 10
						]);
					}
					else{
						sql = mysql.format('select * from traveldb.payment join traveldb.user on traveldb.payment.userId=traveldb.user.id limit ?,?',
						[
							query.begin*1 || 0,
							query.size*1 || 10
						]);
					}
					connection.query(sql,function(err, rows){
						connection.release();
						if(!err){
							util.jsonRespond(response,{
								code:0,
								data:rows,
								msg:''
							});
						}
						else{
							console.log(err);
							util.jsonRespond(response,{
								code:502,
								data:{},
								msg:'query payment failed'
							},{
								status:500
							});
						}
					});
				}
			});
		}
		else{
			util.jsonRespond(response,{
				code:405,
				data:{},
				msg:'method not allowed'
			},{
				status:405
			});
		}
	}
};

module.exports = payment;