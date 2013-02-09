var comb = require('comb');
var schedule = require('node-schedule');
var logger = require(LIB_DIR + 'log_factory').create("sms");
var Communication = require('./communication');

var SMS = comb.define(Communication,{
	instance : {
		send : function(to, noteSubject){
			Twilio.SMS.create({to: "+919945657973", from: "+12243658564", url: "http://4um7.localtunnel.com/sms", body : "Heeloo"}, function(err,res) {
				if(err){
					console.log(err);
				}else
					console.log('You have a new message!');
			});
		}
	}
});

module.exports = new SMS();