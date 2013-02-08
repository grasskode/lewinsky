var comb = require('comb');
var schedule = require('node-schedule');
var logger = require(LIB_DIR + 'log_factory').create("call");
var Communication = require('./communication');

var Call = comb.define(Communication,{
	instance : {
		send : function(to, noteSubject){
			Twilio.Call.create({to: to, from: "+12243658564", url: "http://4um7.localtunnel.com/call"}, function(err,res) {
				if(err){
					console.log(err);
				}else
					console.log('HOLY MOLY! PHONES ARE RINGING');
			});
		}
	}
});

module.exports = new Call();