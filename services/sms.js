var comb = require('comb');
var schedule = require('node-schedule');
var logger = require(LIB_DIR + 'log_factory').create("sms");
var Communication = require('./communication');

var Twilio = require('twilio-js');
Twilio.AccountSid = TWILIO_ACC_ID;
Twilio.AuthToken  = TWILIO_AUTH_TOKEN;

var SMS = comb.define(Communication,{
	instance : {
		send : function(to, noteSubject){
			this.fetchNote(noteSubject, function(err, note){
				if(!err){
					var text = note.body;
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
				}else{
					logger.error(err);
				}
			});
		}
	}
});

module.exports = new SMS();