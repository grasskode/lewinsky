/**
 * Index file that initializes all the routes.
 * Keeps the code clean so that all routes can
 * be controlled from a single place.
 */
module.exports = function(app){
	require('./call_route')(app);
	require('./mail_consumer_route')(app);
//	require('./note_route')(app);
};
