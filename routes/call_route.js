var _ = require('underscore');
var notes_dao = require('../dao/notes');
var logger = require('../utils/log_factory').create("call_route");

var CallRoute = function(app){

	app.get('/call', function(req, res){
		res.send("Hey!");
	});
	
	app.post('/call', function(req, res){
		var user = req.query['user'];
		var noteid = req.query['note'];
		
		if(user && noteid){
			notes_dao.get(user, noteid, function(err, notes){
				if(!err){
                    var text = comm.getBody(notes[noteid]);
                    sendResponse(text);
				}else{
					logger.error(err);
				}
			});
		}else{
			var text = "Hello, No message found";
			sendResponse(text);
		}
		
	});
};

var sendResponse = function(text) {
    res.header("content-type", "text/xml");
    var response = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
            "<Response>" +
            "	<Say>" + text + "</Say>" +
            "</Response>";
    res.send(response);
}

module.exports = function(app){
	return new CallRoute(app);
};
