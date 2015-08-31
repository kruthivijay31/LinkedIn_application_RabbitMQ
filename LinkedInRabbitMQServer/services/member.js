var mysql = require('./mysql');

function handle_request(msg, callback){
	
	var res = {};
	var sqlFindUserId = "select userId from USER where username='"+msg.username+"'"; 
	
	if (msg.type == "showCollection"){
		mysql.handle_database(function(err,results){
			if(err){
				console.log("error");
				throw err;
			}
			else 
			{
				if(results.length > 0){
					console.log("User exists");
					var sqlGetConnections="Call DisplayLinkedConnections('"+msg.username+"')";
					mysql.handle_database(function(err,results){	
						if(err){
							console.log("error");
							throw err;
						}
						else{
							console.log("show collections");
							console.log(JSON.stringify(results));
							callback(null, results);
						}
					},sqlGetConnections);
				}
				else{
					console.log("InValid user");
					res.code = "401";
					res.value = "Failed Login";
					callback(null, res);
				}
			}
		},sqlFindUserId);
	}
	else if (msg.type == "addCollection"){
		mysql.handle_database(function(err,results){
			if(err){
				console.log("error");
				throw err;
			}
			else 
			{
				if(results.length > 0){
					console.log("User exists");
					//console.log(msg.userId);
					var sqlGetConnections="Call LinkedInInvitaton('"+msg.username+"','"+msg.userId+"')";
					mysql.handle_database(function(err,results){	
						if(err){
							console.log("error");
							throw err;
						}
						else{
							console.log("show collections");
							console.log(JSON.stringify(results));
							callback(null, results);
						}
					},sqlGetConnections);
				}
				else{
					console.log("InValid user");
					res.code = "401";
					res.value = "Failed Login";
					callback(null, res);
				}
			}
		},sqlFindUserId);
	}
	else if (msg.type == "acceptCollection"){
		mysql.handle_database(function(err,results){
			if(err){
				console.log("error");
				throw err;
			}
			else 
			{
				if(results.length > 0){
					console.log("User exists");
					console.log(res);
					var sqlGetConnections="Call AddLinkedInConnection('"+msg.username+"','"+msg.userId+"')";
					mysql.handle_database(function(err,results){	
						if(err){
							console.log("error");
							throw err;
						}
						else{
							console.log("show collections");
							console.log(JSON.stringify(results));
							callback(null, results);
						}
					},sqlGetConnections);
				}
				else{
					console.log("InValid user");
					res.code = "401";
					res.value = "Failed Login";
					callback(null, res);
				}
			}
		},sqlFindUserId);
	}
	else if (msg.type == "ignoreCollection"){
		mysql.handle_database(function(err,results){
			if(err){
				console.log("error");
				throw err;
			}
			else 
			{
				if(results.length > 0){
					console.log("User exists");
					var sqlGetConnections="Call IgnoreLinkedInConnection('"+msg.username+"','"+msg.userId+"')";
					mysql.handle_database(function(err,results){	
						if(err){
							console.log("error");
							throw err;
						}
						else{
							console.log("show collections");
							console.log(JSON.stringify(results));
							callback(null, results);
						}
					},sqlGetConnections);
				}
				else{
					console.log("InValid user");
					res.code = "401";
					res.value = "Failed Login";
					callback(null, res);
				}
			}
		},sqlFindUserId);
	}
}

exports.handle_request = handle_request;