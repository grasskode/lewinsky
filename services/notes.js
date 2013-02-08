var fs = require("fs");
var crypto = require('crypto');

var BASE = CONFIG.data_base;

function makeResponse(path, files, callback) {
        var response = {};
        var count = files.length;
        files.forEach(function (file) {
                console.log("reading file : "+path+"/"+file);
                fs.readFile(path+"/"+file, "utf8", function(err, data) {
                    if(!err) {
                            response[file] = data;
                    }
                    else
                            console.log(err);
                    if(--count == 0)
                            callback(true, response);
            });
        });
}

function get(userid, count, noteid, callback) {
        if(!count)
                count = 1;
        console.log("Getting "+count+" notes for "+userid+" from "+noteid);
        var path = BASE+"/"+userid;
        var response;
        fs.exists(path, function (exists) {
                if(exists){
                          fs.stat(path, function(err, stats) {
                                  if(!err && stats.isDirectory()) {
                                          fs.readdir(path, function(err, files) {
                                                  if(!err){
                                                    var index = 0;
                                                    if(noteid)
                                                          index = files.indexOf(noteid);
                                                    if(index >= 0) {
                                                          makeResponse(path, files.slice(index, (index+count > files.length)?files.length:index+count), callback);
                                                    } else {
                                                          console.log("Could not find "+noteid);
                                                          callback(false, {"error" : "Could not find "+noteid});
                                                    }
                                                  } else {
                                                          console.log(err);
                                                          callback(false, {"error" : ""});
                                                  }
                                          });
                                  } else if(err) {
                                          console.log(err);
                                          callback(false, {"error" : ""});
                                  } else {
                                          console.log(userid + " not a directory.");
                                          callback(false, {"error" : ""});
                                  }
                          });
                } else {
                        console.log(userid+" not found.");
                        callback(false, {"error" : userid+" not found."});
                }
        });
}

function create(userid, note, callback) {
        console.log("Creating a new note for "+userid);
        var hash = crypto.createHash('md5').update(note.subject).digest("hex");
        var jsonDate = new Date().toJSON();
        fs.exists(BASE, function(exists) {
                if(!exists)
                  fs.mkdirSync(BASE, 0755);
                fs.exists(BASE+"/"+userid, function(exists) {
                        if(!exists)
                          fs.mkdirSync(BASE+"/"+userid, 0755);
                        var file = fs.createWriteStream(BASE+"/"+userid+"/"+hash, {'flags': 'a'});
                        file.write("\n~~~"+jsonDate+"~~~\n");
                        file.write(note.body);
                        callback(true, hash);
                });
        });
}

function remove(userid, noteid, callback) {
        console.log("Deleting "+noteid+" for "+userid);
        var path = BASE+"/"+userid+"/"+noteid;
        fs.exists(path, function(exists) {
                if(exists) {
                        fs.unlink(path, function (err) {
                                if(err) callback(false, {"error" : "Could not remove."});
                                else callback(true, {"done":""});
                        });
                }
                else {
                        callback(true, {"done":""});
                }
        });
}

exports.get = get;
exports.create = create;
exports.remove = remove;
