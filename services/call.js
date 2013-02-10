var comb = require('comb');
var schedule = require('node-schedule');
var RecurrenceRule = schedule.RecurrenceRule;
var notesImpl = require('./notes');
var logger = require(LIB_DIR + 'log_factory').create("call");
var Communication = require('./comm');

var Twilio = require('twilio-js');
Twilio.AccountSid = TWILIO_ACC_ID;
Twilio.AuthToken  = TWILIO_AUTH_TOKEN;

var Call = comb.define(Communication, {
	instance : {
		constructor : function(options){
			options = options || {};
			this._super(arguments);
		},
		
		send : function(userId, noteSubject){
			this.fetchNote(userId, noteSubject, function(err, note){
				if(!err){
					var to = note.receipent_ph_num;
					Twilio.Call.create({to: to, from: TWILIO_NUMBER, url: TWILIO_CALL_CALLBACK + "?user=" + userId + "&subject=" + noteSubject}, function(err,res) {
						if(err){
							logger.error(err);
						}else
							logger.info('HOLY MOLY! PHONES ARE RINGING');
					});
				}else{
					logger.error(err);
				}
			});
		}
	}
});

module.exports = new Call();