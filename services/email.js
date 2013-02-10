var _ = require('underscore');
var comb = require('comb');
var schedule = require('node-schedule');
var RecurrenceRule = schedule.RecurrenceRule;
var notesImpl = require('./notes');
var logger = require(LIB_DIR + 'log_factory').create("email");
var Communication = require('./comm');

var SendGrid = require('sendgrid').SendGrid;
var sendgrid = new SendGrid(SENDGRID_UID, SENDGRID_KEY);

var Email = comb.define(Communication, {
	instance : {
		constructor : function(options){
			options = options || {};
			this._super(arguments);
		},
		
		send : function(userId, noteSubject){
			this.fetchNote(userId, noteSubject, function(err, notes){
				if(!err){
					_.each(notes, function(note){
						var to = note.receipent_mail;
						var text = this.getBody(note);
						
						sendgrid.send({
							to: to,
							from: MASTER_EMAIL,
							subject: noteSubject,
							text: text
						}, function(success, message) {
							if (!success) {
								logger.error(message);
							}else{
								logger.info("Email sent to : " + to);
							}
						});
					});
				}else{
					logger.error(err);
				}
			});
		}
	}
});

module.exports = new Email();