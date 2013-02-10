var _ = require('underscore');
var logger = require(LIB_DIR + 'log_factory').create("scheduler");
var Call = require('./call');
var SMS = require('./sms');
var Email = require('./email');
var notesImpl = require('./notes');
var moment = require("moment");

var Scheduler = function(){
	this.createCron = function(datestr, repeat) {
		var d = moment(datestr);
		var year = d.year();
		var month = d.month() + 1;
    var day = "*";
		var date = d.date();
		var hour = d.hour();
		var minute = d.minute();

    if(repeat == "yearly")
      year = "*";
    else if(repeat == "monthly"){
      year = "*";
      month = "*";
    }
    else if(repeat == "weekly"){
      year = "*";
      month = "*";
      day = d.day();
    }
    else if(repeat == "daily"){
      year = "*";
      month = "*";
      date = "*";
    }
    else if(repeat == "hourly"){
      year = "*";
      month = "*";
      date = "*";
      hour = "*";
    }
    else if(repeat == "minutely"){
      year = "*";
      month = "*";
      date = "*";
      hour = "*";
      minute = "*";
    }
		
		return minute + " " + hour + " " + day + " " + month + " " + day + " " + year;
	};

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
				'[-0-9,\*]*[[:<:]]' + date.getDate() + '[[:>:]][-0-9,\*]* [-0-9,\*]* [-0-9,\*]*' + 
				'( [-0-9,\*]*[[:<:]]' + date.getFullYear() + '[[:>:]][-0-9,\*]*)?',
			function(err, data){
				if(!err){
					notes = data;
					logger.info(Object.keys(notes).length + " notes found for scheduling");
					_.each(notes, function(note){
						var userId = note.user;
						var subject = note.subject;
						var actions = note.actions;
						
						var noteMap = note.creation_epoch;
						_.each(noteMap, function(entry){
							var cron = entry.cron;
							
							_.each(actions, function(action){
								if(action == 'call'){
									Call.schedule(userId, subject, cron);
								}else if(action == 'sms'){
									SMS.schedule(userId, subject, cron);
								}else if(action == 'email'){
									Email.schedule(userId, subject, cron);
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
