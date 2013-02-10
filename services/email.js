var _ = require('underscore');
var comb = require('comb');
var schedule = require('node-schedule');
var RecurrenceRule = schedule.RecurrenceRule;
var notesImpl = require('./notes');
var logger = require(LIB_DIR + 'log_factory').create("email");

var SendGrid = require('sendgrid').SendGrid;
var sendgrid = new SendGrid(SENDGRID_UID, SENDGRID_KEY);

var Email = comb.define({
	instance : {
		constructor : function(options){
			options = options || {};
			this._super(arguments);
		},
		
		send : function(to, noteSubject, text){
			sendgrid.send({
				to: to,
				from: MASTER_EMAIL,
				subject: noteSubject,
				text: text
			}, function(success, message) {
				if (!success) {
					logger.error(message);
				}else{
					logger.info("Email sent to : " + to);
				}
			});
		}
	}
});

module.exports = new Email();
