var _ = require('underscore');
var comb = require('comb');
var logger = require('../utils/log_factory').create("sms");

var client = require('twilio')(CONFIG.twilio.account_sid, CONFIG.twilio.auth_token);

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
				client.sendSms({
					to      : num, 
					from    : CONFIG.twilio.number, 
					body    : msg_body
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
