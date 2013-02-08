var schedule = require('node-schedule');
var logger = require(LIB_DIR + 'log_factory').create("call");

var Call = function(){
	this.make = function(to, noteSubject){
		Twilio.Call.create({to: to, from: "+12243658564", url: "http://4um7.localtunnel.com/call"}, function(err,res) {
			if(err){
				console.log(err);
			}else
				console.log('HOLY MOLY! PHONES ARE RINGING');
		});
	};
	
	this.scheduleOnce = function(date, to, noteSubject){
		var ref = this;
		schedule.scheduleJob(date, function(){
			console.log('A call to ' + to + ' will be scheduled at : ' + date);
			
			ref.make(to, noteSubject);
		});
	};
	
	this.scheduleRepeat = function(cron, to, noteSubject){
		var ref = this;
		schedule.scheduleJob(cron, function(){
			console.log('A call to ' + to + ' will be scheduled according to cron : ' + cron);
			
			ref.make(to, noteSubject);
		});
	};
};

module.exports = new Call();