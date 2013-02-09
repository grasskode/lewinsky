/**
 * Initialize all routes
 */
module.exports = function(app){
	require('./sms_route')(app);
	require('./call_route')(app);
	require('./mail_consumer_route')(app);
	require('./note_route')(app);
	require('./user_route')(app);
};
