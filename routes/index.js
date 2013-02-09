/**
 * Initialize all routes
 */
module.exports = function(app){
	require('./sms_route')(app);
	require('./call_route')(app);
	require('./note-routes')(app);
};
