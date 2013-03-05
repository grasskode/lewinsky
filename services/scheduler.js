var _ = require('underscore');
var notes_dao = require('../dao/notes');
var schedules_dao = require('../dao/schedules');
var logger = require("../utils/log_factory").create("scheduler");

exports.run = run;
exports.scheduleNotes = scheduleNotes;
exports.scheduleNote = scheduleNote;

/**
 * -> Search for all the notes scheduled for today (or the remaining time)
 * 	-> Create a cron expression
 * 	-> Search notes for that cron expression
 * -> schedule each note according to actions
 */
var run = function(base){
    /*
     * say today is 12-12-2012
     * For notes scheduled for today, the crons can be : 
     * --> [0-59] [0-23] 12 12 [0-7] 2012
     * --> [0-59] [0-23] * 12 [0-7] 2012
     */
    var date = base ? base : new Date();
    s_notes.searchCron('^[-0-9,\*]* [-0-9,\*]* ' + 
            '[-0-9,\*]*([[:<:]]' + date.getDate() + '[[:>:]])?[-0-9,\*]* [-0-9,\*]* [-0-9,\*]*' + 
            '( [-0-9,\*]*[[:<:]]' + date.getFullYear() + '[[:>:]][-0-9,\*]*)?',
        function(err, notes){
            if(!err){
                logger.info(Object.keys(notes).length + " notes found for scheduling");
                scheduleNotes(notes);
            }else{
                logger.error(err);
            }
        });
};

var scheduleNotes = function(notes){
    _.each(notes, function(note){
        var userId = note.user;
        var subject = note.subject;
        var noteMap = note.creation_epoch;
        _.each(noteMap, function(entry){
            var cron = entry.cron;
            if(cron){
                schedules_dao.create();
                //comm.schedule(userId, subject, cron);
            }
        });
        
    });
};

var scheduleNote = function(note){
    scheduleNotes([note]);
};
