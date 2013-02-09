var _ = require('underscore');
var logger = require(LIB_DIR + 'log_factory').create("scheduler");
var Call = require('./call');
var SMS = require('./sms');
var Email = require('./email');
var notesImpl = require('./notes');

var Scheduler = function(){
	/**
	 * -> Search for all the notes scheduled for today (or the remaining time)
	 * 	-> Create a cron expression
	 * 	-> Search notes for that cron expression
	 * -> schedule each note according to actions
	 */
	this.run = function(base){
		/*
		 * say today is 12-12-2012
		 * For notes scheduled for today, the crons can be : 
		 * --> [0-59] [0-23] 12 12 [0-7] 2012
		 * --> [0-59] [0-23] * 12 [0-7] 2012
		 */
		var date = base ? base : new Date();
		notesImpl.searchCron('^[-0-9,\*]* [-0-9,\*]* [-0-9,\*]*[[:<:]]' + 
				date.getDate() + 
				'[[:>:]][-0-9,\*]* [-0-9,\*]* [-0-9,\*]* [-0-9,\*]*[[:<:]]' + 
				date.getFullYear() + '[[:>:]][-0-9,\*]*',
			function(err, data){
				if(!err){
					notes = data;
					_.each(notes, function(note){
						var userId = note.user;
						var subject = note.subject;
						var number = note.receiver_number;
						var email = note.receiver_email;
						var noteMap = note.creation_epoch;
						_.each(noteMap, function(entry){
							var cron = entry.cron;
							// TODO verfiy the next execution time of the cron is in the current day
							
							var actions = entry.actions;
							_.each(actions, function(action){
								if(action == 'call'){
									Call.scheduleRepeat(userId, subject, cron, number);
								}else if(action == 'sms'){
									SMS.scheduleRepeat(userId, subject, cron, number);
								}else if(action == 'email'){
									Email.scheduleRepeat(userId, subject, cron, email);
								}
							});
						});
						
					});
				}else{
					logger.error(err);
				}
			});
	};
};

module.exports = new Scheduler();