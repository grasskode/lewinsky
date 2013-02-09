var logger = require(LIB_DIR + 'log_factory').create("call_route");

var CallRoute = function(app){
	app.get('/call', function(req, res){
		console.log(req);
		
		res.send("Hey!");
	});
	
	app.post('/call', function(req, res){
		console.log(req);
		
		res.header("content-type", "text/xml");
		var response = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
				"<Response>" +
				"	<Say>Hello, This is your personal assistant</Say>" +
				"</Response>";
		
		res.send(response);
	});
};

module.exports = function(app){
	return new CallRoute(app);
};