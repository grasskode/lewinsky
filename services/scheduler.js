var _ = require('underscore');
var logger = require(LIB_DIR + 'log_factory').create("scheduler");
var notesImpl = require('./notes');
var comm = require('./talk');
var eventEmitter = require('../lib/emitter');

var Scheduler = function(){
	var ref = this;
	eventEmitter.on('schedule', function(userId, subject){
		ref.scheduleNote(userId, subject);
	});
	
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
		notesImpl.searchCron('^[-0-9,\*]* [-0-9,\*]* ' + 
				'[-0-9,\*]*([[:<:]]' + date.getDate() + '[[:>:]])?[-0-9,\*]* [-0-9,\*]* [-0-9,\*]*' + 
				'( [-0-9,\*]*[[:<:]]' + date.getFullYear() + '[[:>:]][-0-9,\*]*)?',
			function(err, data){
				if(!err){
					notes = data;
					scheduleJob(notes);
				}else{
					logger.error(err);
				}
			});
	};
	
	this.scheduleNote = function(userId, subject){
		notesImpl.searchSubject(userId, subject, function(err, notes){
			if(!err){
				scheduleJob(notes);
			}else{
				logger.error(err);
			}
		});
	};
	
	var scheduleJob = function(notes){
		logger.info(Object.keys(notes).length + " notes found for scheduling");
		_.each(notes, function(note){
			var userId = note.user;
			var subject = note.subject;
			
			var noteMap = note.creation_epoch;
			_.each(noteMap, function(entry){
				var cron = entry.cron;
				if(cron){
					comm.schedule(userId, subject, cron);
				}
			});
			
		});
	};
};

module.exports = new Scheduler();
