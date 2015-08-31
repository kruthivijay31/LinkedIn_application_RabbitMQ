
function handle_request(msg, callback){
	
	var res = {};
	console.log("In handle request:"+ msg.username);
	
	if(msg.username == "mb@abc.com" && msg.password =="abc123"){
		res.code = "200";
		res.value = "Succes Login";
		
	}
	else{
		res.code = "401";
		res.value = "Failed Login";
	}
	callback(null, res);
}

exports.handle_request = handle_request;