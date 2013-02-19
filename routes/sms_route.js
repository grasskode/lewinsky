var logger = require('../utils/log_factory').create("sms_route");

var SMSRoute = function(app){
	app.post('/sms', function(req, res){
		console.log(req);
		
		res.header("content-type", "text/xml");
		var response = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
				"<Response>" +
				"	<Sms>Hello, Mobile Monkey</Sms>" +
				"</Response>";
		
		res.send(response);
	});
};

module.exports = function(app){
	return new SMSRoute(app);
};
