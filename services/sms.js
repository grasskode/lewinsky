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
            msg_body = subject+" >> "+text;
            logger.debug("Sending message to "+to+"\n"+msg_body);
			_.each(to, function(num){
				Twilio.SMS.create({
					to: num, 
					from: CONFIG.twilio.number, 
					body : msg_body
				}, 
				function(err,res) {
					if(err){
						logger.error(err);
					}else
						logger.info('Message sent!');
				});
			});
		}
	}
});

module.exports = new SMS();
