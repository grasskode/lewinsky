var s_parser = require("../services/parser");
var s_scheduler = require("../services/scheduler");
var notes_dao = require("../dao/notes");
var logger = require("../utils/log_factory").create("consumer");

exports.consume = function(parsedMail, callback) {
    /********************************************
     * expected mail
     ********************************************
     * headers      The raw headers of the email.
     * text         Text body of email. If not set, email did not have a text body.
     * html         HTML body of email. If not set, email did not have an HTML body.
     * from         Email sender, as taken from the message headers.
     * to           Email recipient field, as taken from the message headers.
     * cc           Email cc field, as taken from the message headers.
     * subject      Email Subject.
     * dkim         A JSON string containing the verification results of any dkim and domain keys signatures in the message.
     * SPF          The results of the Sender Policy Framework verification of the message sender and receiving IP address.
     * envelope     A JSON string containing the SMTP envelope. This will have two variables: 
     *              to, which is an array of recipients, and from, which is the return path for the message.
     * charsets     A JSON string containing the character sets of the fields extracted from the message.
     * spam_score   Spam Assassin’s rating for whether or not this is spam.
     * spam_report  Spam Assassin’s spam report.
     * attachments  Number of attachments included in email.
     * attachmentX  These are file upload names, where N is the total number of attachments. 
     *              For example, if the number of attachments is 0, there will be no attachment files. 
     *              If the number of attachments is 3, parameters attachment1, attachment2, and attachment3 
     *              will have file uploads. TNEF files (winmail.dat) will be extracted and have any attachments posted.
     **********************************************
     */

    var user_email = parsedMail.from;
    var matches = user_email.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
    // ASSUMPTION : There cannot be more than one "from"
    var userid = matches[0];
    var subject = get_subject(parsedMail.subject);
    var text = parsedMail.text;
    
    var parsedText = s_parser.parse(text);
    var note = to_note(subject, parsedText);

    notes_dao.create(userid, note, function(err, noteid) {
        if(err)
            callback(err, null);
        else{
            notes_dao.get(userid, noteid, function(err, notes) {
                if(err)
                    callback(err, null);
                else{
                    s_scheduler.scheduleNote(notes[noteid]);
                }
            });
            callback(null, noteid);
        }
    });
};

function get_subject(full_subject) {
    while(true) {
        if(full_subject.indexOf("Re:") == 0 || full_subject.indexOf("Fw:") == 0){
            full_subject = full_subject.substring(3).trim();
        }
        else if (full_subject.indexOf("FWD:") == 0 || full_subject.indexOf("Fwd:") == 0 
                || full_subject.indexOf("Fyi:") == 0 || full_subject.indexOf("FYI:") == 0) {
            full_subject = full_subject.substring(4).trim();
        }
        else
            break;
    }
    return full_subject;
}

/**
 * Utility function to create a note with given subject out of the given parsed text.
 */
function to_note(subject, parsedText) {
  var note = {};
  note['subject'] = subject;
  note['body'] = parsedText['@body'];
  note['receipents'] = (parsedText['@to'])?parsedText['@to'].join(", "):"";
  //note['date'] = (parsedText['@date'])?parsedText['@date'].join(" +0530, "):"";
  if(parsedText['@date']){
      for(var i=0; i<parsedText['@date'].length; i++) {
          var date = parsedText['@date'][i];
          if(note['date'] != "")
              note['date'] += ", ";
          note['date'] += date+" +0530";
      }
  }
  note['repeat'] = (parsedText['@repeat'])?parsedText['@repeat'].join(", "):"";
  note['actions'] = (parsedText['@action'])?parsedText['@action'].join(", "):"";
  if(parsedText['@cancel']){
      for(var i=0; i<parsedText['@cancel'].length; i++) {
          var cancel = parsedText['@cancel'][i];
          if(note['actions'] != "")
              note['actions'] += ", ";
          note['actions'] += "-"+cancel;
      }
  }
  logger.debug(note);
  return note;
}

