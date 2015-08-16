var connection = require('./connection'),
	util = require('./util'),
	mysql = require('mysql'),
	path = require('path'),
	qs = require('querystring'),
	multiparty = require('multiparty'),
	fs = require('fs');

var product ={
	'get':function(pathname, request, response, config){
		if(/get/i.test(request.method)){
			var query = qs.parse(request.parsedUrl.query),
				expiredQuery = '';
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
					var comlumns = [
						'product_serial',
						'product_name',
						'pt_name',
						'product_cover',
						'product_price',
						'product_count',
						'product_timeleft',
						'product_onthecourt',
						'product_oncourtdate'
					];
					if(query.expired*1){
						query.onthecourt = 1;
						expiredQuery = 'and DATEDIFF(now(),product_oncourtdate)>product_timeleft';
					}
					var sql = mysql.format('select ?? from webuy.product join webuy.producttype where product_onthecourt=? '+expiredQuery+' order by product_updatetime limit ?,?',
					[
						comlumns,
						query.onthecourt*1,
						query.begin*1 || 0,
						query.size*1 || 10
					]);
					connection.query(sql,function(err, rows){
						connection.release();
						if(!err){
							util.jsonRespond(response,{
								code:0,
								data:{product:rows},
								msg:''
							});
						}
						else{
							console.log(err);
							util.jsonRespond(response,{
								code:502,
								data:{},
								msg:'query product failed'
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

	},
	'modify':function(pathname, request, response, config){

	},
	'add':function(pathname, request, response, config){
		if(/post/i.test(request.method)){
			var form = new multiparty.Form();
			var rootDirection = config.productPath;

			form.parse(request, function(err, fields, files) {
				if(!err){
					connection.pool.getConnection(function(err, connection){
						var productDir = 'product'+path.sep+new Date()*1;
						var filepath = path.resolve(rootDirection+productDir);
						fs.mkdir(filepath,function(err){
							if(err){
								console.error(err);
								util.jsonRespond(response,{
									code:502,
									data:{},
									msg:'mkdir filepath failed'
								},{
									status:500
								});
							}
							else{
								var promiseArray = [];
								if(files.coverFiles){
									var coverfield = productDir+path.sep+'cover.jpg';
									var coversource = fs.createReadStream(files.coverFiles[0].path);
									var coverdest = fs.createWriteStream(filepath+path.sep+'cover.jpg');

									var coverSavePromise = new Promise(function(resolve,reject){
										coversource.pipe(coverdest);
										coversource.on('error', function(err) {
											console.log(err);
											reject(err);
										});

										coversource.on('end', function() { 
										  	resolve();
										});
									});

									promiseArray.push(coverSavePromise);
								}

								if(files.bannerFiles){
									var bannerfield = productDir+path.sep+'banner.jpg';
									var bannersource = fs.createReadStream(files.bannerFiles[0].path);
									var bannerdest = fs.createWriteStream(filepath+path.sep+'banner.jpg');

									var bannerSavePromise = new Promise(function(resolve,reject){
										bannersource.pipe(bannerdest);
										bannersource.on('error', function(err) {
											console.log(err);
											reject(err);
										});

										bannersource.on('end', function() { 
										  	resolve();
										});
									});

									promiseArray.push(bannerSavePromise);
								}
								//其他数据
								var databasePromise = new Promise(function(resolve, reject){
									var comlumns = [
											'product_serial',
											'product_name', 
											'product_type', 
											'product_price', 
											'product_onthecourt',
											'product_oncourtdate',
											'product_timeleft', 
											'product_count', 
											'product_detail', 
											'product_banner', 
											'product_cover',
											'product_createtime',
											'product_updatetime'
										];

										var date = new Date();
										var values = [
											fields.serial,
											fields.name,
											fields.type,
											fields.price,
											fields.onthecourt,
											fields.onthecourt?new Date():null,
											fields.timeleft,
											fields.count,
											fields.detail,
											bannerfield,
											coverfield,
											date,
											date
										];
										var sql = mysql.format('insert into webuy.product (??) values (?)',[comlumns,values]);
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
											msg:''
										},{
											status:500
										});
									});
								}
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

module.exports = product;