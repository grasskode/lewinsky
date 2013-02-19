var logger = require('../utils/log_factory').create("sms");
var _ = require('underscore');
var comb = require('comb');
var schedule = require('node-schedule');
var RecurrenceRule = schedule.RecurrenceRule;
var notesImpl = require('./notes');
var Twilio = require('twilio-js');

Twilio.AccountSid = CONFIG.twilio.account_sid;
Twilio.AuthToken  = CONFIG.twilio.auth_token;

var SMS = comb.define({
	instance : {
		constructor : function(options){
			options = options || {};
			this._super(arguments);
		},
		
		send : function(to, noteSubject, text){
			_.each(to, function(num){
				Twilio.SMS.create({
					to: num, 
					from: CONFIG.twilio.number, 
					url: CONFIG.twilio.callback.sms, 
					body : text
				}, 
				function(err,res) {
					if(err){
						logger.error(err);
					}else
						logger.info('You have a new message!');
				});
			});
		}
	}
});

module.exports = new SMS();
