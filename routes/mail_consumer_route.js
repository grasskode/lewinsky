var logger = require("../utils/log_factory").create("mail_consumer_route");

/**
 * Utility method to send a plain text http response with given code and message
 */
function respond(res, code, message) {
        res.status(code);
        res.set('Content-Type', 'text/plain');
        res.send(message);
}

/**
 * Routes
 */
module.exports = function(app) {
  
  app.post("/consume", function(req, res) {
    logger.info("Consuming mail :");
    logger.info(req.body);
    s_consumer.consume(req.body, function(err, data) {
        if(err)
            respond(res, 500, err);
        else
            respond(res, 200, data);
    });
  });
  
};
