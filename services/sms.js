var _ = require('underscore');
var comb = require('comb');
var Twilio = require('twilio-js');
var logger = require('../utils/log_factory').create("sms");

Twilio.AccountSid = CONFIG.twilio.account_sid;
Twilio.AuthToken  = CONFIG.twilio.auth_token;

var SMS = comb.define({
	instance : {
		constructor : function(options){
			options = options || {};
			this._super(arguments);
		},
		
		send : function(to, subject, text){
			_.each(to, function(num){
				Twilio.SMS.create({
					to: num, 
					from: CONFIG.twilio.number, 
					url: CONFIG.twilio.callback.sms, 
					body : subject+" >> "+text
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
