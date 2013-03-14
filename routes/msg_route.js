var logger = require('../utils/log_factory').create("msg_route");

var SMSRoute = function(app){
    app.post('/msg', function(req, res){
        logger.info(req + " received.");

        res.header("content-type", "text/xml");
        var response = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
                        "<Response>" +
                            " <Sms>Hello, Mobile Monkey</Sms>" +
                        "</Response>";

        res.send(response);
    });
};

module.exports = function(app){
    return new SMSRoute(app);
};
