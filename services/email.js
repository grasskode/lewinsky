var comb = require('comb');
var schedule = require('node-schedule');
var logger = require(LIB_DIR + 'log_factory').create("email");
var Communication = require('./communication');

var SendGrid = require('sendgrid').SendGrid;
var sendgrid = new SendGrid(SENDGRID_UID, SENDGRID_KEY);

var Email = comb.define(Communication,{
	instance : {
		send : function(to, noteSubject){
			this.fetchNote(noteSubject, function(err, note){
				if(!err){
					var to = note.receipent_mail;
					var subject = note.subject;
					var text = note.body;
					
					sendgrid.send({
						to: to,
						from: MASTER_EMAIL,
						subject: subject,
						text: text
					}, function(success, message) {
						if (!success) {
							console.log(message);
						}else{
							console.log("Email sent to : " + to);
						}
					});
				}else{
					logger.error(err);
				}
			});
		}
	}
});

module.exports = new Email();