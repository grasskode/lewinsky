var comb = require('comb');
var schedule = require('node-schedule');
var logger = require(LIB_DIR + 'log_factory').create("email");
var Communication = require('./communication');

var Email = comb.define(Communication,{
	instance : {
		send : function(to, noteSubject){
			/**
			 * TODO Send Grid integration
			 */
		}
	}
});

module.exports = new Email();