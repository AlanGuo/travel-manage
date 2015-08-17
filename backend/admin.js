var crypto = require('crypto'),
	qs = require('querystring'),
	mysql = require('mysql'),
	shortid = require('shortid'),
	security = require('./security'),
	util = require('./util'),
	bodyParser = require('body-parser'),
	connection = require('./connection'),
	//登录态
	users=[];

var admin = {
	///cgi-bin/admin/signin
	signin:function(pathname, request, response, config){
		if(/post/i.test(request.method)){
			var urlencodedParser = bodyParser.urlencoded({ extended: false });
			urlencodedParser(request,response,function(){
				var postData = request.body;
				if(security.vercode() == postData.vercode){
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
							var comlumns = ['name','email','mobile','password'];
							var sql = mysql.format('select ?? from traveldb.user where type=1 and email=? or mobile=?',[comlumns,postData.login,postData.login]);
							connection.query(sql,function(err, rows){
								connection.release();
								if(!err){
									if(rows.length){
										if(rows[0].password === crypto.createHash('md5').update(postData.userpassword).digest('hex')){
											var nowDate = new Date();
											nowDate = new Date(nowDate.setHours(nowDate.getHours()+2));
											var skey = crypto.createHash('md5').update(rows[0].name+(+new Date())).digest('hex');
											util.jsonRespond(response,{
												code:0,
												data:{},
												msg:''
											},{
												'Set-Cookie':[
													'uin='+postData.login+'; expires='+nowDate.toString()+'; path=/;',
													'skey='+skey+'; expires='+nowDate.toString()+'; path=/'
												]
											});

											var user = users.filter(function(item){
												if(item.uin === postData.login){
													return item;
												}
											});
											if(user && user.length){
												user.skey = skey;
											}
											else{
												users.push({
													uin:postData.login,
													skey:skey,
													loginTime:nowDate
												});
											}
										}
										else{
											util.jsonRespond(response,{
												code:101,
												data:{},
												msg:'登录名或密码错误'
											});
										}
									}
									else{
										util.jsonRespond(response,{
											code:102,
											data:{},
											msg:'登录名或密码错误'
										});
									}
								}
								else{
									console.log(err);
									util.jsonRespond(response,{
										code:502,
										data:{},
										msg:'query user failed'
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
						code:401,
						data:{},
						msg:'验证码错误'
					},{
						status:401
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
	checklogin:function(request){
		var cookie = request.headers.cookie;
		console.log(users);
		return users.filter(function(item){
			if(cookie.indexOf(item.uin)>-1 && 
				cookie.indexOf(item.skey)>-1){
				return item;
			}
		}).length>0;
	}
}

module.exports = admin;