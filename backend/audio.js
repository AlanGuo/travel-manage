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

var audio ={
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
						sql = mysql.format('select * from traveldb.audio where id=?',[
							query.id
						]);
					}
					else if(query.regionId){
						sql = mysql.format('select * from traveldb.audio where regionId=? order by id limit ?,?',[
							query.regionId,
							query.begin*1 || 0,
							query.size*1 || 10
						]);
					}
					else{
						sql = mysql.format('select * from traveldb.audio order by lastmodifytime limit ?,?',
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
								msg:'query audio failed'
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
					var sql = mysql.format('delete from traveldb.audio where id='+query.id);
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
								msg:'delete audio failed'
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
			var form = new multiparty.Form();
			var rootDirection = config.audioPath;

			form.parse(request, function(err, fields, files) {
				if(!err){
					connection.pool.getConnection(function(err, connection){
						var regionDir = fields.regionId[0];
						var filepath = path.resolve(rootDirection+regionDir);
						var promiseArray = [],
							finalpath = filepath+path.sep+crypto.createHash('md5').update(fields.name[0]).digest('hex')+'.mp3',
<<<<<<< HEAD
							url = regionDir+path.sep+crypto.createHash('md5').update(fields.name[0]).digest('hex')+'.mp3';
=======
							url = 'http://assets.xingzuotech.cn/'+regionDir+path.sep+crypto.createHash('md5').update(fields.name[0]).digest('hex')+'.mp3';
>>>>>>> origin/master
						
						if(files.audioFiles){
							var audiosource = fs.createReadStream(files.audioFiles[0].path);
							var audiodest = fs.createWriteStream(finalpath);

							var audioSavePromise = new Promise(function(resolve,reject){
								audiosource.pipe(audiodest);
								audiosource.on('error', function(err) {
									console.log(err);
									reject(err);
								});
								audiosource.on('end', function() { 
								  	resolve();
								});
							});

							promiseArray.push(audioSavePromise);
						}
						//其他数据
						var databasePromise = new Promise(function(resolve, reject){
							var date = new Date();
							var sql = '';
							if(files.audioFiles){
								sql = mysql.format('update traveldb.audio set ??=?,??=?,??=?,??=?,??=?,??=?,??=? where id=?',[
									'name',
									fields.name[0],
									'size',
									fs.statSync(files.audioFiles[0].path).size,
									'file',
									url,
									'lastmodifytime',
									date,
									'longitude',
									fields.longitude[0],
									'latitude',
									fields.latitude[0],
									'regionId',
									fields.regionId[0],
									fields.id
								]);
							}
							else{
								sql = mysql.format('update traveldb.audio set ??=?,??=?,??=?,??=?,??=? where id=?',[
									'name',
									fields.name[0],
									'lastmodifytime',
									date,
									'longitude',
									fields.longitude[0],
									'latitude',
									fields.latitude[0],
									'regionId',
									fields.regionId[0],
									fields.id
								]);
							}
							
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
								msg:'error'
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
			var form = new multiparty.Form();
			var rootDirection = config.audioPath;
			var url = '//assets.xjimi.com/';

			form.parse(request, function(err, fields, files) {
				if(!err){
					connection.pool.getConnection(function(err, connection){
						var regionDir = fields.regionId[0];
						var filepath = path.resolve(rootDirection+regionDir);
						if(!fs.existsSync(filepath)){
							fs.mkdirSync(filepath);
						}
						var promiseArray = [],
							finalpath = filepath+path.sep+crypto.createHash('md5').update(fields.name[0]).digest('hex')+'.mp3';
							url += regionDir+'/'+crypto.createHash('md5').update(fields.name[0]).digest('hex')+'.mp3';
						if(files.audioFiles){
							var audiosource = fs.createReadStream(files.audioFiles[0].path);
							var audiodest = fs.createWriteStream(finalpath);

							var audioSavePromise = new Promise(function(resolve,reject){
								audiosource.pipe(audiodest);
								audiosource.on('error', function(err) {
									console.log(err);
									reject(err);
								});
								audiosource.on('end', function() { 
								  	resolve();
								});
							});

							promiseArray.push(audioSavePromise);
						}
						//其他数据
						var databasePromise = new Promise(function(resolve, reject){
							var comlumns = [
									'name',
									'size',
									'file',
									'lastmodifytime',
									'longitude',
									'latitude',
									'regionId'
								];

								var date = new Date();
								var values = [
									fields.name[0],
									fs.statSync(files.audioFiles[0].path).size,
									url,
									date,
									fields.longitude[0],
									fields.latitude[0],
									fields.regionId[0]
								];
								var sql = mysql.format('insert into traveldb.audio (??) values (?)',[comlumns,values]);
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
									msg:'error'
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

module.exports = audio;