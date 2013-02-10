var _ = require('underscore');
var parser = require("../services/parser");
var s_users = require("../services/users");
var s_notes = require("../services/notes");

function respond(res, code, message) {
        res.status(code);
        res.set('Content-Type', 'text/plain');
        res.send(message);
}

function to_note(subject, parsedText) {
  var note = {};
  note['subject'] = subject;
  note['body'] = parsedText['@body'];
  note['receipents'] = (parsedText['@to'])?parsedText['@to'].join(", "):"";
  note['date'] = (parsedText['@date'])?parsedText['@date'].join(", "):"";
  note['repeat'] = (parsedText['@repeat'])?parsedText['@repeat'].join(", "):"";
  note['actions'] = (parsedText['@action'])?parsedText['@action'].join(", "):"";
  console.log(note);
  return note;
}

module.exports = function(app) {
  
  app.post("/consume", function(req, res) {
    console.log("Consuming mail :");
    console.log(req.body);

    /********************************************
     * expected POST
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

    // This is the only info that we will use right now
    var user_email = req.body.from;
    var matches = user_email.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
    _.each(matches, function(match){
    	var subject = req.body.subject;
        var text = req.body.text;
        
        var parsedText = parser.parse(text);
        var note = to_note(subject, parsedText);

        s_users.get(match, function(err, users) {
          if(err){
            respond(res, 500, err);
          } else {
            if(!users || !users[0])
              respond(res, 500, {"error" : "no user found!"});
            else {
              var userid = users[0].id;
              s_notes.create(userid, note, function(err, data) {
                if(err)
                  respond(res, 500, err);
                else
                  respond(res, 200, data);
              });
            }
          }
        });
    });
  });
  
};
