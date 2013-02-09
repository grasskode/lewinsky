var schedule = require('node-schedule');
var comb = require('comb');
var RecurrenceRule = schedule.RecurrenceRule;
var logger = require(LIB_DIR + 'log_factory').create("communication");
var notesImpl = require('./notes');

var Communication = comb.define(null,{
	instance : {
		constructor : function(options){
			options = options || {};
			this._super(arguments);
		},
		
		isNextInvocationToday : function(cron, base){
			logger.debug("Cron  : " + cron + ", Base : " + base);
			var r = RecurrenceRule.fromCronString(cron);
			var next = r.nextInvocationDate(base);
			
			var year = new Date().getFullYear();
			var month = new Date().getMonth() + 1;
			var date = new Date().getDate();
			
			var today = new Date(year + '-' + month + '-' + date + ' 00:00:00');
			tommorrow = today.setDate(today.getDate() + 1);
			
			if(next > (new Date())){
				logger.debug("Next Trigger time  : " + next);
				return next < tommorrow;
			}else{
				return this.isNextInvocationToday(cron, next);
			}
		},
		
//		scheduleOnce : function(userId, noteSubject, date, to){
//			var ref = this;
//			schedule.scheduleJob(date, function(){
//				logger.info('A communication to ' + to + ' will be scheduled at : ' + date);
//				
//				ref.send(to, noteSubject);
//			});
//		},
		
		getEmails : function(note){
			return ['iitr.sourabh@gmail.com', 'sourabh@accredor.com'];
		},
		
		getNumbers : function(note){
			
		},
		
		getBody : function(note){
			var body = '';
			var entries = note['creation_epoch'];
			for (var key in entries) {
				if (entries.hasOwnProperty(key)) {
					var entry = entries[key];
					body += entry.body;
				}
			}
			
			return body;
		},
		
		scheduleRepeat : function(userId, noteSubject, cron){
			if(this.isNextInvocationToday(cron)){
				var ref = this;
				
				schedule.scheduleJob(cron, function(){
					logger.info('A communication with subject : ' + noteSubject + ' will be scheduled according to cron : ' + cron);
					
					ref.send(userId, noteSubject);
				});
			}else{
				logger.warn("Next invocation of cron : " + cron + " will not be today");
			}
		},
		
		fetchNote : function(userId, noteSubject, callback){
			notesImpl.searchSubject(userId, noteSubject, function(err, data){
				if(!err){
					var note = data;
					callback(null, note);
				}else{
					callback(err);
				}
			});
		}
	}
});

module.exports = Communication;