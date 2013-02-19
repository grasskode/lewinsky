/**
 * Module dependencies.
 */
var express = require('express');
var path = require('path');
var log4js = require('log4js');
var logger = require('./utils/log_factory').create("app");

/**
 * Initialize App
 */
var app = express();
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(err, req, res, next) {
  // only handle `next(err)` calls
  logger.error(err);
  next();
});

/**
 * Routes
 */
require('./routes')(app);

/**
 * Run the server
 */
exports.run = function(port) {
    if(port == null || isNaN (port-0) || port =="")
        port = CONFIG.port;
    app.listen(port);
    logger.info("Lewinsky listening on "+port);
}

//var scheduler = require('./services/scheduler');
//scheduler.run();
