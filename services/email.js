var _ = require('underscore');
var comb = require('comb');
var schedule = require('node-schedule');
var logger = require(LIB_DIR + 'log_factory').create("email");
var Communication = require('./communication');

var SendGrid = require('sendgrid').SendGrid;
var sendgrid = new SendGrid(SENDGRID_UID, SENDGRID_KEY);

var Email = comb.define(Communication,{
	instance : {
		constructor : function(options){
			options = options || {};
			this._super(arguments);
		},
		
		send : function(userId, noteSubject){
			var ref = this;
			this.fetchNote(userId, noteSubject, function(err, notes){
				if(!err){
					_.each(notes, function(note){
						var to = ref.getEmails(note);
						var text = ref.getBody(note);
						
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