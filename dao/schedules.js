var mysql = require("mysql");
var logger = require("../utils/log_factory").create("schedules");

var pool  = mysql.createPool({
  host     : CONFIG.db.host,
  database : CONFIG.db.database,
  user     : CONFIG.db.user,
  password : CONFIG.db.password
});

exports.get = function(timestamp, callback) {
    logger.debug("Getting notes scheduled at "+timestamp);
    pool.getConnection(function(err, connection) {
        // connected! (unless `err` is set)
        if(err)
            logger.error("Connection error!\n"+err);
        else{
            var query = "SELECT * FROM schedules WHERE `timestamp`="+connection.escape(timestamp);
            var sqlquery = connection.query(query, function (err, results) {
                  if(err) {
                    logger.error(err);
                    callback({"error" : "could not get scheduled notes"}, null);
                  } else {
                    callback(null, results);
                  }
                  connection.end();
            });
            // console.log(sqlquery.sql);
        }
    });
};

exports.clear = function() {
    logger.debug("Clearing all schedules!");
    pool.getConnection(function(err, connection) {
        // connected! (unless `err` is set)
        if(err)
            logger.error("Connection error!\n"+err);
        else{
            var sqlquery = connection.query("DELETE FROM schedules", function(err, result) {
                if(err)
                    logger.error(err);
                connection.end();
            });
        }
    });
};

exports.add = function(user, noteid, timestamps) {
    for(index in timestamps) {
        checkAndCreate(user, noteid, timestamps[index]);
    }
};

var checkAndCreate = function(user, noteid, timestamp) {
    get(user, noteid, timestamp, function(err, data) {
        if(err || data.length == 0) {
            create(user, noteid, timestamp, function(err, data){
                if(err)
                    logger.error(err);
            });
        }
    });
};

var create = function(user, noteid, timestamp, callback) {
    logger.debug("Creating schedule for "+noteid+" of "+user+" at "+timestamp);
    pool.getConnection(function(err, connection) {
        // connected! (unless `err` is set)
        if(err)
            logger.error("Connection error!\n"+err);
        else{
            var values = {  user : user,
                            note_id : noteid, 
                            timestamp : timestamp};
            var sqlquery = connection.query("INSERT INTO schedules SET ?", values, function (err, result) {
                if(err) {
                    logger.error(err);
                    callback({"error": "could not create schedule"}, null);
                } else {
                    callback(null, {"success" : "created schedule for "+noteid+" of "+user+" at "+timestamp});
                }   
                connection.end();
            }); 
            // console.log(sqlquery.sql);
        }
    });
};

var get = function(user, noteid, timestamp, callback) {
    logger.debug("Getting schedule for "+noteid+" of "+user+" at "+timestamp);
    pool.getConnection(function(err, connection) {
        // connected! (unless `err` is set)
        if(err)
            logger.error("Connection error!\n"+err);
        else{
            var query = "SELECT * FROM schedules WHERE `user`="+connection.escape(user)+" and `note_id`="+connection.escape(noteid)+" and `timestamp`="+connection.escape(timestamp);
            var sqlquery = connection.query(query, function (err, result) {
                if(err) {
                    logger.error(err);
                    callback(err, null);
                } else {
                    callback(null, result);
                }   
                connection.end();
            });
            //console.log(sqlquery.sql);
        }
    });
};
