/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var path = require('path');
var request = require('request');
var log4js = require('log4js');
var _ = require('underscore');

var constants = require('./lib/constants');
var logger = require(LIB_DIR + 'log_factory').create("app");

/**
 * Initialize App
 */
var app = express();

app.configure(function(){
  app.set('port', CONFIG.port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout : false});
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use(function(err, req, res, next) {
	  // only handle `next(err)` calls
	  console.log("Error occurred");
	  logger.error(err);
	  next();
  });
});

/**
 * Routes
 */
//require('./routes')(app);

app.get('/greet', function (req, res) {
    res.status = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.write("Greetings!");
    res.end();
});


/**
 * Initialize the Server
 */
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

logger.info("Started with settings : " + JSON.stringify(app.settings));

//var scheduler = require('./services/scheduler');
//scheduler.run();
