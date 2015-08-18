var connection = require('./connection'),
	util = require('./util'),
	mysql = require('mysql'),
	path = require('path'),
	qs = require('querystring'),
	bodyParser = require('body-parser'),
	admin = require('./admin'),
	fs = require('fs');

var region ={
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
						sql = mysql.format('select * from traveldb.scenicRegion where id=?',[query.id]);
					}
					else if(query.provinceId){
						sql = mysql.format('select * from traveldb.scenicRegion where provinceId=?',[query.provinceId]);
					}
					else{
						var comlumns = [
							'traveldb.scenicRegion.id',
							'longitude',
							'latitude'
						];
						sql = mysql.format('select ?? ,traveldb.scenicRegion.name as regionName,traveldb.province.name as provinceName from traveldb.scenicRegion join traveldb.province on provinceId = traveldb.province.id order by id limit ?,?',
						[
							comlumns,
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
								msg:'query scenicRegion failed'
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
	},
	'delete':function(pathname, request, response, config){
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
			console.log(query);
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
					var sql = mysql.format('delete from traveldb.scenicRegion where id='+query.id);
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
								msg:'delete scenicRegion failed'
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
	},
	'update':function(pathname, request, response, config){
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
		if(/post/i.test(request.method)){
			var urlencodedParser = bodyParser.urlencoded({ extended: false });
			urlencodedParser(request,response,function(err){
				var postData = request.body;
				if(!err){
					connection.pool.getConnection(function(err, connection){
					var promiseArray = [];
					//其他数据
					var databasePromise = new Promise(function(resolve, reject){
						var comlumns = [
								'name', 
								'provinceId', 
								'latitude',
								'longitude',
							];
							var values = [
								postData.name,
								postData.provinceId,
								postData.latitude,
								postData.longitude,
							];
							var sql = mysql.format('update traveldb.scenicRegion set ??=?,??=?,??=?,??=? where id=?',[
								'name',postData.name,'provinceId',postData.provinceId,'latitude',postData.latitude,'longitude',postData.longitude,postData.id]);

							console.log(sql);
							connection.query(sql, function(err, rows){
								connection.release();
								if(!err){
									resolve();
								}
								else{
									console.log(err);
									reject(err);
								}
							});
						});

						promiseArray.push(databasePromise);
						//处理数据
						Promise.all(promiseArray).then(function(values){
							util.jsonRespond(response,{
								code:0,
								data:{},
								msg:''
							});
						}).catch(function(err){
							console.log(err);
							util.jsonRespond(response,{
								code:500,
								data:{},
								msg:'modify error'
							},{
								status:500
							});
						});
					});
		      	}
		      	else{
		      		console.error(err);
					util.jsonRespond(response,{
						code:501,
						data:{},
						msg:'parse form body failed'
					},{
						status:500
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
	},
	'add':function(pathname, request, response, config){
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
		if(/post/i.test(request.method)){
			var urlencodedParser = bodyParser.urlencoded({ extended: false });
			urlencodedParser(request,response,function(err){
				var postData = request.body;
				if(!err){
					connection.pool.getConnection(function(err, connection){
					var promiseArray = [];
					//其他数据
					var databasePromise = new Promise(function(resolve, reject){
						var comlumns = [
								'name', 
								'provinceId', 
								'latitude',
								'longitude',
							];
							var values = [
								postData.name,
								postData.provinceId,
								postData.latitude,
								postData.longitude,
							];
							var sql = mysql.format('insert into traveldb.scenicRegion (??) values (?)',[comlumns,values]);
							connection.query(sql, function(err, rows){
								connection.release();
								if(!err){
									resolve();
								}
								else{
									console.log(err);
									reject(err);
								}
							});
						});

						promiseArray.push(databasePromise);
						//处理数据
						Promise.all(promiseArray).then(function(values){
							util.jsonRespond(response,{
								code:0,
								data:{},
								msg:''
							});
						}).catch(function(err){
							console.log(err);
							util.jsonRespond(response,{
								code:500,
								data:{},
								msg:'insert error'
							},{
								status:500
							});
						});
					});
		      	}
		      	else{
		      		console.error(err);
					util.jsonRespond(response,{
						code:501,
						data:{},
						msg:'parse form body failed'
					},{
						status:500
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

module.exports = region;