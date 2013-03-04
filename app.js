var express = require('express');
var path = require('path');
var logger = require('./utils/log_factory').create("app");

// Initialize App
var app = express();
app.use(express.logger(CONFIG.env));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(err, req, res, next) {
  // only handle `next(err)` calls
  logger.error(err);
  next();
});

// Require dependencies
require('./routes')(app);
//require('./services/scheduler').run();

/**
 * Run the server
 */
exports.run = function(port) {
    if(port == null || isNaN (port-0) || port =="")
        port = CONFIG.port;
    app.listen(port);
    logger.info("Lewinsky listening on "+port);
}
