var admin = require('./admin'),
	crypto = require('crypto'),
	util = require('./util'),
	path = require('path'),
	fs = require('fs'),
	zlib = require('zlib'),
	request = require('request'),
	multiparty = require('multiparty'),
	bodyParser = require('body-parser');

var file = {
	//file/upload
	'upload':function(pathname, request, response, config){
		// if(!admin.checklogin(request)){
		// 	util.jsonRespond(response,{
		// 		code:403,
		// 		data:{},
		// 		msg:'no login'
		// 	},{
		// 		status:403
		// 	});
		// 	return;
		// }
		if(/post/i.test(request.method)){
			var form = new multiparty.Form();
			var rootDirection = config.filePath;

			form.parse(request, function(err, fields, files) {
				if(!err){
						var filepath = path.resolve(rootDirection);
						if(!fs.existsSync(filepath)){
							fs.mkdirSync(filepath);
						}

						var promiseArray = [],
							finalpat = '',
							url;
						if(files.file){
							
							finalpath = filepath+path.sep+'uploadfiles'+path.sep+files.file[0].originalFilename;
							url = 'http://192.168.1.102:9000/uploadfiles/'+files.file[0].originalFilename;
						
							var audiosource = fs.createReadStream(files.file[0].path);
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
						//处理数据
						Promise.all(promiseArray).then(function(values){
							util.jsonRespond(response,{
								code:0,
								data:{url:url},
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
	'querydevice':function(pathname, req, res, config){
		//http://dm.xiazaibao.xunlei.com/xiazaibao/user/querydevice
		var urlencodedParser = bodyParser.urlencoded({ extended: false });
		urlencodedParser(req,res,function(){
			var postData = req.body;

			request.get({
			  headers: {
			  	'postman-token': 'b163e97c-a7dd-bbcc-d59a-54c412e116ce',
		        'cache-control': 'no-cache',
		        'connection': 'keep-alive',
		        'accept-encoding': 'gzip, deflate',
		        'accept-language': 'zh-Hans-CN;q=1, en-CN;q=0.9',
		        'user-agent': 'TimeCloud/2.3 (iPhone; iOS 9.3.1; Scale/3.00)',
		        'Cookie':'bindtype=1; mbid=f5c8680763244531; v=2.3.1.370; from=1; clientoperationid=113;' + postData.cookie,
		        'accept': '*/*',
		        'host': 'dm.xiazaibao.xunlei.com'
			  },
			  gzip:true,
			  url:'http://dm.xiazaibao.xunlei.com/xiazaibao/user/querydevice',
			  qs: {
			    userid: postData.userid
			  }
			}, function(error, response, body){
				//console.log(body);
				if(error){
					console.log(error);
					util.jsonRespond(res,{
						code:500,
						data:{},
						msg:'error'
					},{
						status:500
					});
				}
				else{
					util.jsonRespond(res,{
						code:0,
						data:JSON.parse(body),
						msg:''
					});
				}
			});
		});
	},
	'push':function(pathname, req, res, config){
		var urlencodedParser = bodyParser.urlencoded({ extended: false });
		urlencodedParser(req,res,function(){
			var postData = req.body;
			var postBody = 'json='+encodeURIComponent('{"path":"C:\\/TDDOWNLOAD\\/","tasks":[{"gcid":"","filesize":0,"url":"'+postData.task.replace(/\//g,'\\/')+'","name":"'+postData.task.split(/\//).slice(-1)[0]+'","cid":"","ext_json":{"autoname":1}}]}');
			console.log(postData.cookie);

			request.post({
			  headers: {
			  	'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
				'Accept-Encoding':'gzip, deflate',
				'Accept-Language':'en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4,de;q=0.2,zh-TW;q=0.2,ja;q=0.2',
				'Cache-Control':'max-age=0',
				'Connection':'keep-alive',
				'Content-Type':'application/x-www-form-urlencoded',
				'Cookie':'bindtype=1; mbid=f5c8680763244531; v=2.3.1.370; from=1; clientoperationid=113;' + postData.cookie,
				'Host':'homecloud.remote.xiazaibao.xunlei.com',
				'Origin':'http://yc.xzb.xunlei.com',
				'Referer':'http://yc.xzb.xunlei.com/',
				'Upgrade-Insecure-Requests':1,
				'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'
			  },
			  gzip:true,
			  url:'http://yc.xiazaibao.xunlei.com:8182/createTask?pid='+postData.pid+'&v=2&ct=0',
			  body:postBody
			}, function(error, response, body){
				console.log(body);
				if(error){
					console.log(error);
					util.jsonRespond(res,{
						code:500,
						data:{},
						msg:'error'
					},{
						status:500
					});
				}
				else{
					util.jsonRespond(res,{
						code:0,
						data:{},
						msg:''
					});
				}
			});
		});
	}
}

module.exports = file;