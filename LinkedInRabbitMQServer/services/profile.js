var mysql = require('./mysql');

function handle_request(msg, callback){
	var res = {};
	var sqlFindUserId = "select userId from USER where username='"+msg.username+"'"; 
	if (msg.type == "saveExp")
	{
		mysql.handle_database(function(err,results){
			if(err){
				console.log("error");
				throw err;
			}
			else 
			{
				if(results.length > 0){
					console.log("User exists");
					var sqlinsertIntoExp = "Insert into USER_EXPERIENCE (userId,companyName,title,location,description) values ('"+results[0].userId+"','"+msg.company+"','"+msg.title+"','"+msg.location+"','"+msg.description+"')";
					mysql.handle_database(function(err,results){	
						if(err){
							console.log("error");
							throw err;
						}
						else{
							console.log("Exp dat inserted");
							res.code = "200";
							res.value = "Success Login";
							console.log("res" +res.code);
							callback(null, res);	
						}
					},sqlinsertIntoExp);
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
	else if(msg.type == "editExp")
	{
		mysql.handle_database(function(err,results){
			if(err){
				console.log("error");
				throw err;
			}
			else 
			{
				if(results.length > 0){
					console.log("User exists");
					var sqlinsertIntoExp = "Update USER_EXPERIENCE set companyName='"+msg.company+"',title='"+msg.title+"',location='"+msg.location+"',description='"+msg.description+"' WHERE userId='"+results[0].userId+"' and expId='"+msg.expId+"'";
					mysql.handle_database(function(err,results){
						
						if(err){
							console.log("error");
							throw err;
						}
						else{
							console.log("Exp data updated");
							res.code = "200";
							res.value = "Success Login";
							callback(null, res);
						}
					},sqlinsertIntoExp);
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
	else if (msg.type == "getTime"){
		mysql.handle_database(function(err,results){
			if(err){
				console.log("error");
				throw err;
			}
			else 
			{
				if(results.length > 0){
					console.log("User exists");
					var sqlGetExp = "select lastLoggedIn from USER WHERE userId='"+results[0].userId+"'";
					mysql.handle_database(function(err,results){
						
						if(err){
							console.log("error");
							throw err;
						}
						else{
							console.log("time data fetched");
							results.push({"code":"200"});
							console.log(JSON.stringify(results));
							callback(null, results);
							//res.send(results);
						}
					},sqlGetExp);
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
	else if (msg.type == "getExp")
	{
		mysql.handle_database(function(err,results){
			if(err){
				console.log("error");
				throw err;
			}
			else 
			{
				if(results.length > 0){
					console.log("User exists");
					var sqlGetExp = "select Max(expId) as expId,companyName,title,location,description from USER_EXPERIENCE WHERE userId='"+results[0].userId+"' and expId=(select max(expId) from USER_EXPERIENCE WHERE userId='"+results[0].userId+"')";
					mysql.handle_database(function(err,results){
						
						if(err){
							console.log("error");
							throw err;
						}
						else{
							console.log("exp data fetched");
							results.push({"code":"200"});
							console.log(JSON.stringify(results));
							callback(null, results);
							//res.send(results);
						}
					},sqlGetExp);
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
	else if (msg.type == "getEdu"){
		mysql.handle_database(function(err,results){
			if(err){
				console.log("error");
				throw err;
			}
			else 
			{
				if(results.length > 0){
					console.log("User exists");
					var sqlGetEdu = "select Max(eduId) as eduId,school,degreeDesc,degree,fieldOfStudy,grade,activities,descriptionEdu from DEGREE_LIST AS d INNER JOIN USER_EDUCATION AS u ON d.degreeId=u.degree and u.userId ='"+results[0].userId+"' and eduId=(select max(eduId) from USER_EDUCATION WHERE userId='"+results[0].userId+"')";
					//var sqlGetEdu = "select Max(eduId) as eduId,school,degree,fieldOfStudy,grade,activities,descriptionEdu from USER_EDUCATION where userId ='"+results[0].userId+"' and eduId=(select max(eduId) from USER_EDUCATION WHERE userId='"+results[0].userId+"')";
					mysql.handle_database(function(err,results){
						
						if(err){
							console.log("error");
							throw err;
						}
						else{
							console.log("edu data fetched");
							results.push({"code":"200"});
							console.log(JSON.stringify(results));
							callback(null, results);
							//res.send(results);
						}
					},sqlGetEdu);
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
	else if (msg.type == "saveEdu"){
		mysql.handle_database(function(err,results){
			if(err){
				console.log("error");
				throw err;
			}
			else 
			{
				if(results.length > 0){
					console.log("User exists");
					var sqlinsertIntoEdu = "Insert into USER_EDUCATION (userId,school,degree,fieldOfStudy,grade,activities,descriptionEdu) values ('"+results[0].userId+"','"+msg.school+"','"+msg.degree+"','"+msg.fieldOfStudy+"','"+msg.grade+"','"+msg.activities+"','"+msg.description+"')";
					mysql.handle_database(function(err,results){
						
						if(err){
							console.log("error");
							throw err;
						}
						else{
							console.log("Edu dat inserted");
							res.code = "200";
							res.value = "Success Login";
							console.log("res" +res.code);
							callback(null, res);
						}
					},sqlinsertIntoEdu);
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
	else if (msg.type == "editEdu"){
		mysql.handle_database(function(err,results){
			if(err){
				console.log("error");
				throw err;
			}
			else 
			{
				if(results.length > 0){
					console.log("User exists");
					var sqlinsertIntoEdu = "Update USER_EDUCATION set school='"+msg.school+"',degree='"+msg.degree+"',fieldOfStudy='"+msg.fieldOfStudy+"',grade='"+msg.grade+"',activities='"+msg.activities+"',descriptionEdu='"+msg.description+"' WHERE userId='"+results[0].userId+"' and eduId='"+msg.eduId+"'";
					mysql.handle_database(function(err,results){
						
						if(err){
							console.log("error");
							throw err;
						}
						else{
							console.log("Edu data updated");
							res.code = "200";
							res.value = "Success Login";
							callback(null, res);
						}
					},sqlinsertIntoEdu);
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
	
	else if(msg.type == "saveSum"){
		mysql.handle_database(function(err,results){
			if(err){
				console.log("error");
				throw err;
			}
			else 
			{
				if(results.length > 0){
					console.log("User exists");
					var sqlinsertIntoSum = "Update USER set summary='"+msg.summary+"' WHERE userId='"+results[0].userId+"'";
					mysql.handle_database(function(err,results){
						
						if(err){
							console.log("error");
							throw err;
						}
						else{
							console.log("sum data inserted");
							res.code = "200";
							res.value = "Success Login";
							callback(null, res);
						}
					},sqlinsertIntoSum);
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
	else if(msg.type == "getSum"){
		mysql.handle_database(function(err,results){
			if(err){
				console.log("error");
				throw err;
			}
			else 
			{
				if(results.length > 0){
					console.log("User exists");
					var sqlGetExp = "select summary from USER WHERE userId='"+results[0].userId+"'";
					mysql.handle_database(function(err,results){
						
						if(err){
							console.log("error");
							throw err;
						}
						else{
							console.log("sum data fetched");
							results.push({"code":"200"});
							console.log(JSON.stringify(results));
							callback(null, results);
						}
					},sqlGetExp);
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
	else if(msg.type == "getSkill"){
		mysql.handle_database(function(err,results){
			if(err){
				console.log("error");
				throw err;
			}
			else 
			{
				if(results.length > 0){
					console.log("User exists");
					var sqlGetskill = "select skills from USER WHERE userId='"+results[0].userId+"'";
					mysql.handle_database(function(err,results){
						
						if(err){
							console.log("error");
							throw err;
						}
						else{
							console.log("skill data fetched");
							results.push({"code":"200"});
							console.log(JSON.stringify(results));
							callback(null, results);
						}
					},sqlGetskill);
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
	
	else if(msg.type == "saveSkill"){
		mysql.handle_database(function(err,results){
			if(err){
				console.log("error");
				throw err;
			}
			else 
			{
				if(results.length > 0){
					console.log("User exists");
					var sqlinsertIntoSkill = "Update USER set skills='"+msg.skill+"' WHERE userId='"+results[0].userId+"'";
					mysql.handle_database(function(err,results){
						
						if(err){
							console.log("error");
							throw err;
						}
						else{
							console.log("skill data inserted");
							res.code = "200";
							res.value = "Success Login";
							callback(null, res);
						}
					},sqlinsertIntoSkill);
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