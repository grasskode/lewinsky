var _ = require('underscore');
var moment = require("moment");
var notes_dao = require('../dao/notes');
var schedules_dao = require('../dao/schedules');
var logger = require("../utils/log_factory").create("scheduler");

exports.run = run;
exports.scheduleNotes = scheduleNotes;
exports.scheduleNote = scheduleNote;

/**
 * -> Run every 24 hours TODO
 * -> clear the existing schedules TODO
 * -> Search for all the notes scheduled for today (or the remaining time)
 *  -> Create a cron expression
 * 	-> Search notes for that cron expression
 * -> schedule each note according to actions
 */
var run = function(base){
    /*
     * say today is 12-12-2012
     * For notes scheduled for today, the crons can be : 
     * --> [0-59] [0-23] 12 12 [0-6] 2012
     * --> [0-59] [0-23] * 12 [0-6] 2012
     */
    var date = base ? base : new Date();
    notes_dao.searchCron('^[-0-9,\*]* [-0-9,\*]* ' + 
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

/**
 * Schedule multiple notes
 */
var scheduleNotes = function(notes){
    _.each(notes, function(note){
        scheduleNote(note);
    });
};

/**
 * Schedule one note
 */
var scheduleNote = function(note){
    var crons = [];
    _.each(note.creation_epoch, function(entry){
        if(! _.contains(crons, entry.cron)){
            crons.push(entry.cron);
        }
    });
    timestamps = getTimestamps(crons);
    s_schedules.add(note.user, note.subject, timestamps, function(err) {
        if(err)
            logger.error(err);
    });
};

/**
 * Utility function to get the timestamps corresponding to the
 * given crons in the interval of one day.
 */
var getTimestamps = function(crons) {
    timestamps = [];
    var d = moment();
    var year = d.year();
    var day = d.day();
    var month = d.month() + 1;
    var date = d.date();
    var hour = d.hour();
    var minute = d.minute();
    
    _.each(crons, function(cron) {
        tokens = cron.split(" ");
        if (tokens[5] && (tokens[5] == year || tokens[5] == "*")
            && (tokens[4] == day || tokens[4] == "*")
            && (tokens[3] == month || tokens[3] == "*")
            && (tokens[2] == date || tokens[2] == "*")) {
        
            hours = [tokens[1]];
            if(tokens[1] == "*")
                hours = range(0, 23);

            minutes = [tokens[0]];
            if(tokens[0] == "*")
                minutes = range(0, 59);

            _.each(hours, function(hh) {
                _.each(minutes, function(mm) {
                    timestamp = moment();
                    timestamp.year(year);
                    timestamp.month(month-1);
                    timestamp.date(date);
                    timestamp.hour(hh);
                    timestamp.minute(mm);

                    if (! _.contains(timestamps, timestamp)) 
                        timestamps.push(timestamp.format("DD-MM-YYYY HH:mm"));
                });
            });
        }
    });
    return timestamps;
};

//console.log(getTimestamps(["0 * * * * *"]))

// Utility function to make a ranged array
function range(start, end)
{
    var foo = [];
    for (var i = start; i <= end; i++)
        foo.push(i);
    return foo;
}
