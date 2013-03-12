var _ = require('underscore');
var Call = require('./call');
var SMS = require('./sms');
var Email = require('./email');
var notes_dao = require('../dao/notes');
var logger = require('../utils/log_factory').create("communicator");

exports.execute = function(user, noteid) {
    notes_dao.get(user, noteid, function(err, note) {
        if(err)
            logger.error(err);
        else {
            send(note[noteid]);
        }
    });
};

var getBody = function(note){
    var body = '';
    var entries = note['creation_epoch'];
    for (var key in entries) {
        if (entries.hasOwnProperty(key)) {
            var entry = entries[key];
            body += entry.body + "\n";
        }
    }
    return body;
};
	
var send = function(note){
    logger.debug("Sending note");
    logger.debug(note);
    var noteid = note.note_id;
    var user = note.user;
    var subject = note.subject;
    var email = note.receipent_mail;
    var number = note.receipent_ph_num;
    var text = getBody(note);
    var actions = note.actions;
    
    _.each(actions, function(action){
        if(action.length > 0){
          logger.debug("Trying to launch "+action+" for "+user+" ("+subject+")");
          if(action == 'call'){
              Call.send(number, noteid, user);
          }else if(action == 'msg'){
              SMS.send(number, subject, text);
          }else if(action == 'mail'){
              Email.send(email, subject, text);
          } else {
              logger.error("action : " + action+" not found.");
          }
        }
    });
};
	
