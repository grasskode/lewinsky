var _ = require('underscore');
var comb = require('comb');
var schedule = require('node-schedule');
var RecurrenceRule = schedule.RecurrenceRule;
var notesImpl = require('./notes');
var logger = require('../utils/log_factory').create("email");
var SendGrid = require('sendgrid').SendGrid;

var sendgrid = new SendGrid(CONFIG.sendgrid.uid, CONFIG.sendgrid.key);

var Email = comb.define({
	instance : {
		constructor : function(options){
			options = options || {};
			this._super(arguments);
		},
		
		send : function(to, noteSubject, text){
			sendgrid.send({
				to: to,
				from: CONFIG.sendgrid.master_email,
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
