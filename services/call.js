var _ = require('underscore');
var comb = require('comb');
var schedule = require('node-schedule');
var RecurrenceRule = schedule.RecurrenceRule;
var notesImpl = require('./notes');
var logger = require(LIB_DIR + 'log_factory').create("call");
var Communication = require('./comm');

var Twilio = require('twilio-js');
Twilio.AccountSid = TWILIO_ACC_ID;
Twilio.AuthToken  = TWILIO_AUTH_TOKEN;

var Call = comb.define(Communication, {
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
		
		getBody : function(note){
			var body = '';
			var entries = note['creation_epoch'];
			for (var key in entries) {
				if (entries.hasOwnProperty(key)) {
					var entry = entries[key];
					body += entry.body + "\n";
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
		
		schedule : function(userId, noteSubject, cron){
			this.scheduleRepeat(userId, noteSubject, cron);
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
		},
		
		send : function(userId, noteSubject){
			this.fetchNote(userId, noteSubject, function(err, notes){
				if(!err){
					_.each(notes, function(note){
						var to = note.receipent_ph_num;
						Twilio.Call.create({to: to, from: TWILIO_NUMBER, url: TWILIO_CALL_CALLBACK + "?user=" + userId + "&subject=" + noteSubject}, function(err,res) {
							if(err){
								logger.error(err);
							}else
								logger.info('HOLY MOLY! PHONES ARE RINGING');
						});
					});
				}else{
					logger.error(err);
				}
			});
		}
	}
});

module.exports = new Call();
