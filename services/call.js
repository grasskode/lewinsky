var comb = require('comb');
var schedule = require('node-schedule');
var logger = require(LIB_DIR + 'log_factory').create("call");
var Communication = require('./communication');

var Twilio = require('twilio-js');
Twilio.AccountSid = TWILIO_ACC_ID;
Twilio.AuthToken  = TWILIO_AUTH_TOKEN;

var Call = comb.define(Communication,{
	instance : {
		send : function(to, noteSubject){
			Twilio.Call.create({to: to, from: TWILIO_NUMBER, url: TWILIO_CALL_CALLBACK + "?sub=" + noteSubject}, function(err,res) {
				if(err){
					logger.error(err);
				}else
					logger.info('HOLY MOLY! PHONES ARE RINGING');
			});
		}
	}
});

module.exports = new Call();