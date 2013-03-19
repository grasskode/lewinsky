var crypto = require('crypto');
var mysql = require("mysql");
var moment = require("moment");
var logger = require("../utils/log_factory").create("notes");

var searchCron = function(cron, callback) {
        var connection = mysql.createConnection({
          host : CONFIG.db.host,
          database : CONFIG.db.database,
          user : CONFIG.db.user,
          password : CONFIG.db.password,
        });
        var query = "SELECT * FROM notes WHERE `exec_cron` REGEXP '"+cron+"' ORDER BY `note_id`, `creation_epoch`";
        var sqlquery = connection.query(query, function (err, results) {
              if(err) {
                logger.error(err);
                callback(err, null);
              } else {
                var response = consolidate(results);
                callback(null, response);
              }
              connection.destroy();
        });
        // console.log(sqlquery.sql);
};

var get = function(userid, noteid, callback) {
        logger.info("Getting "+noteid+" for "+userid);
        
        var connection = mysql.createConnection({
          host : CONFIG.db.host,
          database : CONFIG.db.database,
          user : CONFIG.db.user,
          password : CONFIG.db.password,
        });
        var query = "SELECT * FROM notes WHERE `user`="+connection.escape(userid)+" and `note_id`="+connection.escape(noteid)+" ORDER BY `note_id`, `creation_epoch`";
        var sqlquery = connection.query(query, function (err, results) {
              if(err) {
                logger.error(err);
                callback({"error" : "could not get notes"}, null);
              } else {
                var response = consolidate(results);
                callback(null, response);
              }
              connection.destroy();
        });
        // console.log(sqlquery.sql);
};

/**
 * Utility function to create a cron out of the date string and the repeat pattern
 */
var createCron = function(datestr, repeat) {
    if(!datestr)
      return null;

	var d = moment(datestr);
	var year = d.year();
	var month = d.month() + 1;
    var day = "*";
	var date = d.date();
	var hour = d.hour();
	var minute = d.minute();
    
    if(repeat){
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
    }
	
	return minute + " " + hour + " " + date + " " + month + " " + day + " " + year;
};

/**
 * Create a new note for the given userid
 */
var create = function(userid, note, callback) {
        logger.info("Creating a new note for "+userid);
        var connection = mysql.createConnection({
          host : CONFIG.db.host,
          database : CONFIG.db.database,
          user : CONFIG.db.user,
          password : CONFIG.db.password,
        });
        var hash = crypto.createHash('md5').update(note.subject).digest("hex");
        var exec_cron = createCron(note.date, note.repeat);
        var values = {note_id : hash, 
                      user : userid, 
                      subject : note.subject, 
                      body : note.body, 
                      creation_epoch : new Date().getTime(),
                      exec_cron : exec_cron,
                      receipents : note.receipents,
                      actions : note.actions};
        var sqlquery = connection.query("INSERT INTO notes SET ?", values, function (err, result) {
              if(err) {
                logger.error(err);
                callback({"error" : "could not add note"}, null);
              } else {
                callback(null, hash);
              }
              connection.destroy();
        });
        // console.log(sqlquery.sql);
};

/*
 * Remove a note for a user
 */
var remove = function(userid, noteid, callback) {
        logger.info("Deleting "+noteid+" for "+userid);
        var connection = mysql.createConnection({
          host : CONFIG.db.host,
          database : CONFIG.db.database,
          user : CONFIG.db.user,
          password : CONFIG.db.password,
        });
        var sqlquery = connection.query("DELETE FROM notes WHERE `note_id`="+connection.escape(noteid)+" and `user`="+connection.escape(userid), function (err, result) {
              if(err) {
                logger.error(err);
                callback({"error" : "could not remove note"}, null);
              } else {
                callback(null, "done");
              }
              connection.destroy();
        });
        // console.log(sqlquery.sql);
};

/*
 * Utility function to consolidate the entries into a single note
 */
function consolidate(entries) {
  var note = {}; 
  entries.forEach(function(entry) {
    if(!note[entry.note_id])
      note[entry.note_id] = {}; 
    
    note[entry.note_id]['note_id'] = entry.note_id;
    note[entry.note_id]['user'] = entry.user;
    note[entry.note_id]['subject'] = entry.subject;
    
    if(!note[entry.note_id]['receipent_mail'])
      note[entry.note_id]['receipent_mail'] = new Array();
    if(!note[entry.note_id]['receipent_ph_num'])
      note[entry.note_id]['receipent_ph_num'] = new Array();
    if(!note[entry.note_id]['actions'])
      note[entry.note_id]['actions'] = new Array();
   
    var split = entry.receipents.split(", ");
    for(var index in split) {
      var s = split[index];
      if(is_mail(s) && note[entry.note_id]['receipent_mail'].indexOf(s) < 0)
        note[entry.note_id]['receipent_mail'].push(s);
      if(is_ph_num(s) && note[entry.note_id]['receipent_ph_num'].indexOf(s) < 0)
        note[entry.note_id]['receipent_ph_num'].push(s);
    }   
    
    var asplit = entry.actions.split(", ");
    for(var index in asplit) {
      var a = asplit[index];
      var a_dash = "-"+a;
      var cancel = false;
      if(a.indexOf("-") == 0){
          a_dash = a.substring(1);
          cancel = true;
      }
      var index = note[entry.note_id]['actions'].indexOf(a_dash);
      if(index < 0) {
          if(note[entry.note_id]['actions'].indexOf(a) < 0)
                note[entry.note_id]['actions'].push(a);
      } else {
          note[entry.note_id]['actions'].splice(index, 1);
      }
    }   
    
    if(!note[entry.note_id]['creation_epoch'])
        note[entry.note_id]['creation_epoch'] = {}; 
    
    note[entry.note_id]['creation_epoch'][entry.creation_epoch] = {}; 
    note[entry.note_id]['creation_epoch'][entry.creation_epoch]['body'] = entry.body;
    note[entry.note_id]['creation_epoch'][entry.creation_epoch]['cron'] = entry.exec_cron;
  });
  return note;
};

function is_mail(element, index, array){
  return element.match(/^(\w|\.)*@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);
}

function is_ph_num(element, index, array) {
  return element.match(/^\+(\d)+$/);
}

//console.log(is_mail("iitr.sourabh@abc.com"));
//console.log(is_ph_num("+1231234567890"));
//console.log(is_ph_num("abc@abc.com"));
//console.log(is_mail("+1231234567890"));

exports.get = get;
exports.create = create;
exports.remove = remove;
exports.searchCron = searchCron;
