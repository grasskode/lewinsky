var _ = require('underscore');
var schedule = require('node-schedule');
var comb = require('comb');
var RecurrenceRule = schedule.RecurrenceRule;
var logger = require('../utils/log_factory').create("communication");
var Call = require('./call');
var SMS = require('./sms');
var Email = require('./email');
var notesImpl = require('./notes');

var Talk = function(){
	this.isNextInvocationToday = function(cron, base){
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
	};
	
	this.getBody = function(note){
		var body = '';
		var entries = note['creation_epoch'];
		for (var key in entries) {
			if (entries.hasOwnProperty(key)) {
				var entry = entries[key];
				body += entry.body + "\n";
			}
		}
		
		return body;
	};
	
	this.scheduleRepeat = function(userId, noteSubject, cron){
		if(this.isNextInvocationToday(cron)){
			var ref = this;
			
			schedule.scheduleJob(cron, function(){
				logger.info('A communication with subject : ' + noteSubject + ' will be scheduled according to cron : ' + cron);
				
				ref.send(userId, noteSubject);
			});
		}else{
			logger.warn("Next invocation of cron : " + cron + " will not be today");
		}
	};
	
	this.schedule = function(userId, noteSubject, cron){
		this.scheduleRepeat(userId, noteSubject, cron);
	};
	
	this.fetchNote = function(userId, noteSubject, callback){
		notesImpl.searchSubject(userId, noteSubject, function(err, data){
			if(!err){
				var note = data;
				callback(null, note);
			}else{
				callback(err);
			}
		});
	};
	
	this.send = function(userId, noteSubject){
		var ref = this;
		this.fetchNote(userId, noteSubject, function(err, notes){
			if(!err){
				_.each(notes, function(note){
					console.log(note);
					var email = note.receipent_mail;
					var number = note.receipent_ph_num;
					var text = ref.getBody(note);
					var actions = note.actions;
					
					_.each(actions, function(action){
						if(action.length > 0){
			              logger.debug("Trying to launch "+action+" for "+userId+" ("+noteSubject+")");
			              if(action == 'call'){
			            	  Call.send(number, noteSubject, userId, text);
			              }else if(action == 'msg'){
			            	  SMS.send(number, noteSubject, text);
			              }else if(action == 'mail'){
			            	  Email.send(email, noteSubject, text);
			              } else {
			            	  logger.error("action : " + action+" not found.");
			              }
						}
					});
				});
			}else{
				logger.error(err);
			}
		});
	};
	
};

module.exports = new Talk();
