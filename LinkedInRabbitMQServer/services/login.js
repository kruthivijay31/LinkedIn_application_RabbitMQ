var mysql = require('./mysql');
var bcrypt = require ('bcrypt');

function handle_request(msg, callback){
	var res = {};
	var sqlFindUser = "select * from USER where username='"+msg.username+"'";
	if(msg.type == "login"){
		console.log('inside login');
	console.log("Query is:"+sqlFindUser);
	mysql.handle_database(function(err,results){
		if(err){
			console.log("error");
			throw err;
		}
		else{
			console.log(results);
			if(results.length > 0){
				var sqlGetPassword = "select password from USER where username='"+msg.username+"'";
				console.log("Query is:"+sqlGetPassword);
				
				mysql.handle_database(function(err,results){
					if(err){
						console.log("error");
						throw err;
					}
					else{
						console.log("results"+results);
						
						 bcrypt.compare(msg.password, results[0].password, function(err, response) {
						    	console.log("output is " +response);
						    	if(response){
						    		var getUserById="select userId from USER where username='"+msg.username+"'";
						    		mysql.handle_database(function(err,results){
										console.log("inside");
										if(err){
											console.log("error");
											throw err;
										}
										else{
											var date= new Date(Date.now());
											var updateLastLogin="UPDATE USER SET lastLoggedIn='"+date+"' WHERE userId='"+results[0].userId+"'";
											mysql.handle_database(function(err,results){
												console.log("inside");
												if(err){
													console.log("error");
													throw err;
												}
												else{
										    		console.log("Valid user");
										    		res.code = "200";
													res.value = "Success Login";
													callback(null, res);
												}
											},updateLastLogin);
										}
									},getUserById);
						    		console.log(res);
						    	}
						    	else{
						    		console.log("InValid user");
						    		res.code = "401";
						    		res.value = "Failed Login";
						    		callback(null, res);
						    	}
						    	console.log(res);
						    });
					}
				},sqlGetPassword);		
			}
			else {  
				console.log("InValid user");
				res.code = "401";
				res.value = "Failed Login";
				callback(null, res);
			}
		}
	},sqlFindUser);
}
	else if (msg.type == "signup")
		{
		console.log('inside signup');
		console.log("Query is:"+sqlFindUser);
		mysql.handle_database(function(err,results){
			if(err){
				console.log("error");
				throw err;
			}
			else 
			{
				if(results.length > 0){
					console.log("User alreasy exists");
		    		res.code = "401";
		    		res.value = "Failed Signup";
		    		callback(null, res);
				}
				else {    
					console.log("New user");
					bcrypt.genSalt(10, function(err, salt) {
					    bcrypt.hash(msg.password, salt, function(err, hash) {
					    	var date= new Date(Date.now());
					    	var sqlNewUser = "insert into USER (firstName,lastName,username,password,lastLoggedIn) values ('"+msg.firstname+"','"+msg.lastname+"','"+msg.username+"','"+hash+"','"+date+"')";
							console.log("Query is:"+sqlNewUser);
							
							mysql.handle_database(function(err,results){
								console.log("inside");
								if(err){
									console.log("error");
									throw err;
								}
								console.log("Valid user");
					    		res.code = "200";
								res.value = "Success Signup";
								callback(null, res);
							},sqlNewUser);
					    	});
						});
					console.log("User added");
					}
			}
		},sqlFindUser);
	}
}

exports.handle_request = handle_request;
