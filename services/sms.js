var logger = require(LIB_DIR + 'log_factory').create("sms");
var _ = require('underscore');
var comb = require('comb');
var schedule = require('node-schedule');
var RecurrenceRule = schedule.RecurrenceRule;
var notesImpl = require('./notes');

var Twilio = require('twilio-js');
Twilio.AccountSid = TWILIO_ACC_ID;
Twilio.AuthToken  = TWILIO_AUTH_TOKEN;

var SMS = comb.define({
	instance : {
		constructor : function(options){
			options = options || {};
			this._super(arguments);
		},
		
		send : function(to, noteSubject, text){
			Twilio.SMS.create({
				to: to, 
				from: TWILIO_NUMBER, 
				url: TWILIO_SMS_CALLBACK, 
				body : text
			}, 
			function(err,res) {
				if(err){
					logger.error(err);
				}else
					logger.info('You have a new message!');
			});
		}
	}
});

module.exports = new SMS();
