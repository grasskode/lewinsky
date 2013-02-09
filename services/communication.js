var schedule = require('node-schedule');
var logger = require(LIB_DIR + 'log_factory').create("communication");

var Communication = function(){
	this.scheduleOnce = function(userId, noteSubject, date, to){
		var ref = this;
		schedule.scheduleJob(date, function(){
			console.log('A communication to ' + to + ' will be scheduled at : ' + date);
			
			ref.send(to, noteSubject);
		});
	};
	
	this.scheduleRepeat = function(userId, noteSubject, cron, to){
		var ref = this;
		schedule.scheduleJob(cron, function(){
			console.log('A communication to ' + to + ' will be scheduled according to cron : ' + cron);
			
			ref.send(to, noteSubject);
		});
	};
	
	this.fetchNote = function(userId, noteSubject, callback){
		notes.searchSubject(userId, noteSubject, function(err, data){
			if(!err){
				var note = data;
				callback(null, note);
			}else{
				callback(err);
			}
		});
	};
};

module.exports = new Communication();