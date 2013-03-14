var _ = require('underscore');
var Call = require('./call');
var SMS = require('./sms');
var Email = require('./email');
var notes_dao = require('../dao/notes');
var s_parser = require('../services/parser');
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

var send = function(note){
    logger.debug("Sending note");
    logger.debug(note);
    var noteid = note.note_id;
    var user = note.user;
    var subject = note.subject;
    var email = note.receipent_mail;
    if(!email || email == "")
        email = user;
    var number = note.receipent_ph_num;
    var text = s_parser.getBody(note);
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
