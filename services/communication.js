var schedule = require('node-schedule');
var RecurrenceRule = schedule.RecurrenceRule;
var logger = require(LIB_DIR + 'log_factory').create("communication");

var Communication = function(){
//	this.scheduleOnce = function(userId, noteSubject, date, to){
//		var ref = this;
//		schedule.scheduleJob(date, function(){
//			console.log('A communication to ' + to + ' will be scheduled at : ' + date);
//			
//			ref.send(to, noteSubject);
//		});
//	};
	
	var isNextInvocationToday = function(cron, base){
		var r = RecurrenceRule.fromCronString(cron);
		var next = r.nextInvocationDate(base);
		
		var year = new Date().getFullYear();
		var month = new Date().getMonth() + 1;
		var date = new Date().getDate();
		
		var today = new Date(year + '-' + month + '-' + date + ' 00:00:00');
		tommorrow = today.setDate(today.getDate() + 1);
		
		if(next > (new Date())){
			return next < tommorrow;
		}else{
			return isNextInvocationToday(cron, next);
		}
	};
	
	this.scheduleRepeat = function(userId, noteSubject, cron, to){
		if(isNextInvocationToday(cron)){
			var ref = this;
			schedule.scheduleJob(cron, function(){
				console.log('A communication to ' + to + ' will be scheduled according to cron : ' + cron);
				
				ref.send(to, noteSubject);
			});
		}else{
			logger.warn("Next invocation of cron : " + cron + " will not be today");
		}
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