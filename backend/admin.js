var crypto = require('crypto'),
	qs = require('querystring'),
	mysql = require('mysql'),
	shortid = require('shortid'),
	security = require('./security'),
	util = require('./util'),
	bodyParser = require('body-parser'),
	connection = require('./connection'),
	Sequelize = require('sequelize'),
	schema = require('./schema'),
	//登录态
	users=[];

var admin = {
	///cgi-bin/admin/signin
	signin:function(pathname, request, response, config){
		if(/post/i.test(request.method)){
			var urlencodedParser = bodyParser.urlencoded({ extended: false });
			urlencodedParser(request,response,function(){
				var postData = request.body;
				return schema.Admin.findOne({
					where: {
					    email: postData.login
					}
				}).then(function(user) {
					if(user){
						if(user.password === crypto.createHash('md5').update(postData.userpassword).digest('hex')){
							var curDate = new Date();
							var nowDate = new Date(curDate.getTime() + 1000 * 2592000);
							var skey = crypto.createHash('md5').update(user.uid+(+new Date())).digest('hex');
							// console.log(user.uid);
							util.jsonRespond(response, {
								code:0,
								data:{},
								msg:''
							},{
								'Set-Cookie':[
									'uid='+user.uid+'; expires='+nowDate.toString()+'; path=/;',
									'name='+user.name+'; expires='+nowDate.toString()+'; path=/;', 
									'skey='+skey+'; expires='+nowDate.toString()+'; path=/'
								]
							});
							users.push({uid:user.uid,skey:skey,loginTime:nowDate*1});
						}else{
							util.jsonRespond(response,{
								code:101,
								data:{},
								msg:'登录名或密码错误'
							});
						}
					}else{
						util.jsonRespond(response,{
							code:101,
							data:{},
							msg:'登录名或密码错误'
						});
					}

				}).catch(function(err) {
					// console.log(err);
					util.jsonRespond(response,{
						code:502,
						data:{},
						msg:JSON.stringify(err)
					},{
						status:500
					});
				});
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
		console.log(cookie);
		var loginedUsers = users.filter(function(item){
			if(cookie.indexOf(item.uin)>-1 && 
				cookie.indexOf(item.skey)>-1){
				return item;
			}
		});
		if(loginedUsers && loginedUsers.length){
			var nowDate = new Date();
			if(loginedUsers[0].loginTime > nowDate){
				//延长两个小时
				var nowDate = new Date();
				loginedUsers[0].loginTime = new Date(nowDate.setHours(nowDate.getHours()+2));
				return true;
			}
			else{
				//删除过期用户
				users.splice(users.indexOf(loginedUsers[0]),1);
				return false;
			}
		}
	}
}

module.exports = admin;