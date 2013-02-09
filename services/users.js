var fs = require("fs");
var mysql = require("mysql");
var crypto = require("crypto");

function get(user_email, callback) {
        console.log("Getting user for "+user_email);
        
        var connection = mysql.createConnection({
          host : CONFIG.db.host,
          database : CONFIG.db.database,
          user : CONFIG.db.user,
          password : CONFIG.db.password,
        });
        var query = "SELECT * FROM users WHERE `email`="+connection.escape(user_email);
        var sqlquery = connection.query(query, function (err, result) {
              if(err) {
                console.log(err);
                callback({"error" : "could not get user"});
              } else {
                if(!result)
                  callback({"error" : "no user found for "+user_email});
                else {
                  console.log(result);
                  callback(null, result);
                }
              }
              connection.destroy();
        });
        console.log(sqlquery.sql);
}

function create(user, callback) {
        console.log("Creating a new user");
        var connection = mysql.createConnection({
          host : CONFIG.db.host,
          database : CONFIG.db.database,
          user : CONFIG.db.user,
          password : CONFIG.db.password,
        });
        var hash = crypto.createHash('md5').update(user.email).digest("hex");
        var values = {id : hash, 
                      email : user.email, 
                      ph_num : user.ph_num};
        var sqlquery = connection.query("INSERT INTO users SET ?", values, function (err, result) {
              if(err) {
                console.log(err);
                callback({"error" : "could not add user"});
              } else {
                callback(null, hash);
              }
              connection.destroy();
        });
        console.log(sqlquery.sql);
}

function remove(userid, callback) {
        console.log("Deleting user "+userid);
        var connection = mysql.createConnection({
          host : CONFIG.db.host,
          database : CONFIG.db.database,
          user : CONFIG.db.user,
          password : CONFIG.db.password,
        });
        var sqlquery = connection.query("DELETE FROM users WHERE `id`="+connection.escape(userid), function (err, result) {
              if(err) {
                console.log(err);
                callback({"error" : "could not remove user"});
              } else {
                callback(null, "done");
              }
              connection.destroy();
        });
        console.log(sqlquery.sql);
}

exports.get = get;
exports.create = create;
exports.remove = remove;
