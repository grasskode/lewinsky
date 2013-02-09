var fs = require("fs");
var crypto = require('crypto');
var mysql = require("mysql");
var parser = require("./parser");
var scheduler = require("./scheduler");

function searchSubject(userid, subject, callback) {
        console.log("Searching "+userid+"'s notes for subject "+subject);
        var connection = mysql.createConnection({
          host : CONFIG.db.host,
          database : CONFIG.db.database,
          user : CONFIG.db.user,
          password : CONFIG.db.password,
        });
        var query = "SELECT * FROM notes WHERE `user`="+connection.escape(userid)+" and `subject`="+connection.escape(subject)+" ORDER BY `note_id`, `creation_epoch`";
        var sqlquery = connection.query(query, function (err, results) {
              if(err) {
                console.log(err);
                callback(err);
              } else {
                var response = parser.consolidate(results);
                callback(null, response);
              }
              connection.destroy();
        });
        console.log(sqlquery.sql);
}

function searchCron(cron, callback) {
        var connection = mysql.createConnection({
          host : CONFIG.db.host,
          database : CONFIG.db.database,
          user : CONFIG.db.user,
          password : CONFIG.db.password,
        });
        var query = "SELECT * FROM notes WHERE `exec_cron` REGEXP '"+cron+"' ORDER BY `note_id`, `creation_epoch`";
        var sqlquery = connection.query(query, function (err, results) {
              if(err) {
                console.log(err);
                callback(err, null);
              } else {
                var response = parser.consolidate(results);
                callback(null, response);
              }
              connection.destroy();
        });
        console.log(sqlquery.sql);
}

function get(userid, noteid, callback) {
        console.log("Getting "+noteid+" for "+userid);
        
        var connection = mysql.createConnection({
          host : CONFIG.db.host,
          database : CONFIG.db.database,
          user : CONFIG.db.user,
          password : CONFIG.db.password,
        });
        var query = "SELECT * FROM notes WHERE `user`="+connection.escape(userid)+" and `note_id`="+connection.escape(noteid)+" ORDER BY `note_id`, `creation_epoch`";
        var sqlquery = connection.query(query, function (err, results) {
              if(err) {
                console.log(err);
                callback(false, {"error" : "could not get notes"});
              } else {
                var response = parser.consolidate(results);
                callback(true, response);
              }
              connection.destroy();
        });
        console.log(sqlquery.sql);
}

/*function get(userid, count, from, callback) {
        if(!count)
                count = 1;
        console.log("Getting "+count+" notes for "+userid+" from "+from);
        
        var connection = mysql.createConnection({
          host : CONFIG.db.host,
          database : CONFIG.db.database,
          user : CONFIG.db.user,
          password : CONFIG.db.password,
        });
        var query = "SELECT * FROM notes WHERE `user`="+connection.escape(userid)+" ORDER BY `note_id`, `creation_epoch`";
        var sqlquery = connection.query(query, function (err, results) {
              if(err) {
                console.log(err);
                callback(false, {"error" : "could not get notes"});
              } else {
                var response = parser.consolidate(results, count, noteid);
                console.log(response);
                callback(true, response);
              }
              connection.destroy();
        });
        console.log(sqlquery.sql);
}*/

function create(userid, note, callback) {
        console.log("Creating a new note for "+userid);
        var connection = mysql.createConnection({
          host : CONFIG.db.host,
          database : CONFIG.db.database,
          user : CONFIG.db.user,
          password : CONFIG.db.password,
        });
        var hash = crypto.createHash('md5').update(note.subject).digest("hex");
        var values = {note_id : hash, 
                      user : userid, 
                      subject : note.subject, 
                      body : note.body, 
                      creation_epoch : new Date().getTime(),
                      exec_cron : scheduler.createCron(note.date, note.repeat),
                      receipents : note.receipents,
                      actions : note.actions};
        var sqlquery = connection.query("INSERT INTO notes SET ?", values, function (err, result) {
              if(err) {
                console.log(err);
                callback(false, {"error" : "could not add note"});
              } else {
                callback(true, hash);
              }
              connection.destroy();
        });
        console.log(sqlquery.sql);
}

function remove(userid, noteid, callback) {
        console.log("Deleting "+noteid+" for "+userid);
        var connection = mysql.createConnection({
          host : CONFIG.db.host,
          database : CONFIG.db.database,
          user : CONFIG.db.user,
          password : CONFIG.db.password,
        });
        var sqlquery = connection.query("DELETE FROM notes WHERE `note_id`="+connection.escape(noteid)+" and `user`="+connection.escape(userid), function (err, result) {
              if(err) {
                console.log(err);
                callback(false, {"error" : "could not remove note"});
              } else {
                callback(true, "done");
              }
              connection.destroy();
        });
        console.log(sqlquery.sql);
}

exports.get = get;
exports.create = create;
exports.remove = remove;
exports.searchSubject = searchSubject;
exports.searchCron = searchCron;
