var express = require('express');
var router = express.Router();
var mq_client = require('../rpc/client');
var ses;
var eduId;
var expId;

router.get('/', function(req, res) {
	  res.render('home');
	});

router.post('/aftersignup', function(req, res) {
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var username = req.body.username;
	var password = req.body.password;
	ses=req.session;
	ses.username=username;
	console.log(ses.username + 'session');
	var msg_payload = { "username": username, "password": password, "type": "signup" , "lastname": lastname,"firstname":firstname };
		
	console.log("In POST Request = UserName:"+ username+" "+password);
	
	mq_client.make_request('login_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err)
		{
			throw err;
		}
		else 
		{
			
			if(results.code == 200){
				console.log("valid Login");
				res.send({"signup":"Success"});
			}
			else {    
				
				console.log("Invalid Login");
				res.send({"signup":"Fail"});
			}
		}  
	});
	
});

router.post('/afterlogin', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	ses=req.session;
	ses.username=username;
	var msg_payload = { "username": username, "password": password, "type": "login"};
		
	console.log("In POST Request = UserName:"+ username+" "+password);
	
	mq_client.make_request('login_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err)
		{
			throw err;
		}
		else 
		{
			if(results.code == 200){
				console.log("valid Login");
				res.send({"login":"Success"});
			}
			else {    
				
				console.log("Invalid Login");
				res.send({"login":"Fail"});
			}
		}  
	});
	
});

router.get('/logout', function(req, res){
	console.log(req.session.username);
	  req.session.destroy(function(err){
		  if(err){
			  console.log(err);
		  }
		  else{
			  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'); 
			  res.redirect('/login');
		  }
		  
	  });
});

router.get('/home', function(req, res) {
	  res.render('home');
});

router.get('/profile', function(req, res) {
	ses=req.session;
	console.log(ses.username);
	if(ses.username){
		console.log(ses.username);
	  res.render('profile');
	  }
	else{
		res.render('home');
	}
});

router.get('/profile/:user?', function(req, res) {
	ses=req.session;
	if(ses.username){
		console.log(ses.username);
	  res.render('profile');
	  }
	else{
		res.render('home');
	}
});

router.get('/login', function(req, res) {
	  res.render('login');
});

router.get('/signup', function(req, res) {
	  res.render('signup');
});

router.get('/Connection', function(req, res) {
	ses=req.session;
	if(ses.username){
		console.log(ses.username);
	  res.render('Connection');
	  }
	else{
		res.render('home');
	}
});

router.get('/editprofile', function(req, res) {
	ses=req.session;
	if(ses.username){
		console.log(ses.username);
	  res.render('editprofile');
	  }
	else{
		res.render('home');
	}
});

router.get('/getTime', function(req, res) {
	var msg_payload = { "username": req.session.username,"type": "getTime"};
	console.log(msg_payload.type);
	
	mq_client.make_request('profile_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err)
		{
			throw err;
		}
		else 
		{
			console.log(results[1].code);
			if(results[1].code == '200'){
				console.log("time data fetched");
				results.pop();
				res.send(results);
			}
			else{    
				console.log("Invalid Login");
				res.send({"time":"Fail"});
			}
		}  
	});
});

router.post('/saveExperience', function(req, res) {
	var company = req.body.company;
	var title = req.body.title;
	var location = req.body.location;
	var description = req.body.description;
	var msg_payload = { "company": company, "title": title, "type": "saveExp" , "location": location,"description":description,"username":req.session.username};
	mq_client.make_request('profile_queue',msg_payload, function(err,results){
		console.log(results);
		if(err)
		{
			throw err;
		}
		else 
		{	
			if(results.code == 200){
				console.log("valid Login");
				res.send({"exp":"Success"});
			}
			else {    
				
				console.log("Invalid Login");
				res.send({"exp":"Fail"});
			}
		}  
	});
});

router.get('/getExp', function(req, res) {
	var msg_payload = { "username": req.session.username,"type": "getExp"};		
	
	mq_client.make_request('profile_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err)
		{
			throw err;
		}
		else 
		{
			if(results[1].code == '200'){
				results.pop();
				console.log("expid"+results[0].expId);
				expId=results[0].expId;
				console.log("exp data fetched");
				res.send(results);
			}
			else{    
				console.log("Invalid Login");
				res.send({"exp":"Fail"});
			}
		}  
	});
});

router.post('/editExperience', function(req, res) {
	var company = req.body.company;
	var title = req.body.title;
	var location = req.body.location;
	var description = req.body.description;
	console.log(ses.username + 'session');
	var msg_payload = { "company": company, "title": title, "type": "editExp" , "location": location,"description":description, "username":req.session.username, "expId":expId};
	
	mq_client.make_request('profile_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err)
		{
			throw err;
		}
		else 
		{		
			if(results.code == 200){
				console.log("exp data updated");
				res.send({"exp":"Success"});
			}
			else{    
				console.log("Invalid Login");
				res.send({"exp":"Fail"});
			}
		}  
	});
});

router.post('/saveEducation', function(req, res) {
	var school = req.body.school;
	var degree = req.body.degree;
	var fieldOfStudy = req.body.fieldOfStudy;
	var activities = req.body.activities;
	var description = req.body.description;
	var grade = req.body.grade;
	console.log(ses.username + 'session');
	var msg_payload = { "school": school, "degree": degree, "type": "saveEdu" , "fieldOfStudy": fieldOfStudy,"description":description, "username":req.session.username, "activities":activities,"grade":grade};
	
	mq_client.make_request('profile_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err)
		{
			throw err;
		}
		else 
		{		
			if(results.code == 200){
				console.log("edu data updated");
				res.send({"edu":"Success"});
			}
			else{    
				console.log("Invalid Login");
				res.send({"edu":"Fail"});
			}
		}  
	});
	
});

router.get('/getEdu', function(req, res) {
var msg_payload = { "username": req.session.username,"type": "getEdu"};		
	
	mq_client.make_request('profile_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err)
		{
			throw err;
		}
		else 
		{
			if(results[1].code == '200'){
				results.pop();
				console.log("eduid"+results[0].eduId);
				eduId=results[0].eduId;
				console.log("edu data fetched");
				res.send(results);
			}
			else{    
				console.log("Invalid Login");
				res.send({"edu":"Fail"});
			}
		}  
	});
});

router.post('/editEducation', function(req, res) {
	var school = req.body.school;
	var degree = req.body.degree;
	var fieldOfStudy = req.body.fieldOfStudy;
	var activities = req.body.activities;
	var description = req.body.description;
	var grade = req.body.grade;
	console.log(ses.username + 'session');
	var msg_payload = { "school": school, "degree": degree, "type": "editEdu" , "fieldOfStudy": fieldOfStudy,"description":description, "username":req.session.username, "activities":activities,"grade":grade,"eduId":eduId};
	
	mq_client.make_request('profile_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err)
		{
			throw err;
		}
		else 
		{		
			if(results.code == 200){
				console.log("edu data updated");
				res.send({"edu":"Success"});
			}
			else{    
				console.log("Invalid Login");
				res.send({"edu":"Fail"});
			}
		}  
	});
});

router.post('/saveSummary', function(req, res) {
	var summary = req.body.summary;
	console.log(ses.username + 'session');
	var msg_payload = { "summary": summary,"type": "saveSum","username":req.session.username};
	
	mq_client.make_request('profile_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err)
		{
			throw err;
		}
		else 
		{		
			if(results.code == 200){
				console.log("sum data inserted");
				res.send({"sum":"Success"});
			}
			else{    
				console.log("Invalid Login");
				res.send({"sum":"Fail"});
			}
		}  
	});
});

router.get('/getSum', function(req, res) {
var msg_payload = { "username": req.session.username,"type": "getSum"};		
	
	mq_client.make_request('profile_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err)
		{
			throw err;
		}
		else 
		{
			if(results[1].code == '200'){
				results.pop();
				console.log("sum data fetched");
				res.send(results);
			}
			else{    
				console.log("Invalid Login");
				res.send({"sum":"Fail"});
			}
		}  
	});
});

router.post('/saveSkill', function(req, res) {
	var skill = req.body.skill;
	console.log(ses.username + 'session');
	var msg_payload = { "skill": skill,"type": "saveSkill","username":req.session.username};
	
	mq_client.make_request('profile_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err)
		{
			throw err;
		}
		else 
		{		
			if(results.code == 200){
				console.log("skill data inserted");
				res.send({"skill":"Success"});
			}
			else{    
				console.log("Invalid Login");
				res.send({"skill":"Fail"});
			}
		}  
	});
});

router.get('/getSkills', function(req, res) {
var msg_payload = { "username": req.session.username,"type": "getSkill"};		
	
	mq_client.make_request('profile_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err)
		{
			throw err;
		}
		else 
		{
			if(results[1].code == '200'){
				results.pop();
				console.log("skill data fetched");
				res.send(results);
			}
			else{    
				console.log("Invalid Login");
				res.send({"skill":"Fail"});
			}
		}  
	});
});

router.post('/showConnections',function(req,res){
	
	var msg_payload = { "username": req.session.username,"type": "showCollection"};		
	
	mq_client.make_request('member_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err)
		{
			throw err;
		}
		else 
		{
			if(results.code == '401'){
				console.log("Invalid Login");
				res.send({"connection":"Fail"});
			}
			else{    
				console.log("skill data fetched");
				res.send(results);
			}
		}  
	});
});

router.post('/addconnection', function(req, res) {
	var userId = req.body.userId;
	var msg_payload = { "username": req.session.username,"type": "addCollection","userId":userId};		
	
	mq_client.make_request('member_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err)
		{
			throw err;
		}
		else 
		{
			if(results.code == '401'){
				console.log("Invalid Login");
				res.send({"connection":"Fail"});
			}
			else{    
				console.log("skill data fetched");
				res.send(results);
			}
		}  
	});
});

router.post('/acceptconnection', function(req, res) {
	var userId = req.body.userId;
	var msg_payload = { "username": req.session.username,"type": "acceptCollection","userId":userId};		
	
	mq_client.make_request('member_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err)
		{
			throw err;
		}
		else 
		{
			if(results.code == '401'){
				console.log("Invalid Login");
				res.send({"connection":"Fail"});
			}
			else{    
				console.log("skill data fetched");
				res.send(results);
			}
		}  
	});
});

router.post('/ignoreconnection', function(req, res) {
	var userId = req.body.userId;
	var msg_payload = { "username": req.session.username,"type": "ignoreCollection","userId":userId};		
	
	mq_client.make_request('member_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err)
		{
			throw err;
		}
		else 
		{
			if(results.code == '401'){
				console.log("Invalid Login");
				res.send({"connection":"Fail"});
			}
			else{    
				console.log("skill data fetched");
				res.send(results);
			}
		}  
	});
	
});
module.exports = router;