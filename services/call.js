var _ = require('underscore');
var comb = require('comb');
var logger = require('../utils/log_factory').create("call");

var Twilio = require('twilio-js');
Twilio.AccountSid = CONFIG.twilio.account_sid;;
Twilio.AuthToken  = CONFIG.twilio.auth_token;

var Call = comb.define({
	instance : {
		constructor : function(options){
			options = options || {};
			this._super(arguments);
		},
		
		send : function(to, noteid, user){
            logger.debug("Calling "+to+" with note "+noteid+" on behalf of "+user);
			_.each(to, function(num){
				Twilio.Call.create({to: num, from: CONFIG.twilio.number, 
                                    url: CONFIG.twilio.callback.call 
                                            + "?user=" + encodeURIComponent(user) 
                                            + "&note=" + encodeURIComponent(noteid)}, 
                                    function(err,res) {
					if(err){
						logger.error(err);
					}else
						logger.info('Call placed!');
				});
			});
		}
	}
});

module.exports = new Call();
