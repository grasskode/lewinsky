var _ = require('underscore');
var comb = require('comb');
var logger = require(LIB_DIR + 'log_factory').create("call_route");
var Communication = require('../services/talk');

var CallRoute = function(app){
	app.get('/call', function(req, res){
		res.send("Hey!");
	});
	
	app.post('/call', function(req, res){
		var user = req.query['user'];
		var subject = req.query['subject'];
		
		if(user && subject){
			var comm = Communication;
			
			comm.fetchNote(user, subject, function(err, notes){
				if(!err){
					_.each(notes, function(note){
						var text = comm.getBody(note);
						
						res.header("content-type", "text/xml");
						var response = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
								"<Response>" +
								"	<Say>" + text + "</Say>" +
								"</Response>";
						
						res.send(response);
					});
				}else{
					logger.error(err);
				}
			});
		}else{
			var text = "Hello, No message found";
			
			res.header("content-type", "text/xml");
			var response = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
					"<Response>" +
					"	<Say>" + text + "</Say>" +
					"</Response>";
			
			res.send(response);
		}
		
	});
};

module.exports = function(app){
	return new CallRoute(app);
};