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
		
		isNextInvocationToday : function(cron, base){
			logger.debug("Cron  : " + cron + ", Base : " + base);
			var r = RecurrenceRule.fromCronString(cron);
			var next = r.nextInvocationDate(base);
			
			var year = new Date().getFullYear();
			var month = new Date().getMonth() + 1;
			var date = new Date().getDate();
			
			var today = new Date(year + '-' + month + '-' + date + ' 00:00:00');
      tommorrow = today.setDate(today.getDate() + 1);
			
			if(next > (new Date())){
				logger.debug("Next Trigger time  : " + next);
				return next < tommorrow;
			}else{
				return this.isNextInvocationToday(cron, next);
			}
		},
		
		getBody : function(note){
			var body = '';
			var entries = note['creation_epoch'];
			for (var key in entries) {
				if (entries.hasOwnProperty(key)) {
					var entry = entries[key];
					body += entry.body + "\n";
				}
			}
			
			return body;
		},
		
		scheduleRepeat : function(userId, noteSubject, cron){
			if(this.isNextInvocationToday(cron)){
        console.log("Next invocation today. Scheduling");
				var ref = this;
				
				schedule.scheduleJob(cron, function(){
          console.log("IN scheduleJob");
					logger.info('A communication with subject : ' + noteSubject + ' will be scheduled according to cron : ' + cron);
					
					ref.send(userId, noteSubject);
				});
			}else{
				logger.warn("Next invocation of cron : " + cron + " will not be today");
			}
		},
		
		schedule : function(userId, noteSubject, cron){
			this.scheduleRepeat(userId, noteSubject, cron);
		},
		
		fetchNote : function(userId, noteSubject, callback){
			notesImpl.searchSubject(userId, noteSubject, function(err, data){
				if(!err){
					var note = data;
					callback(null, note);
				}else{
					callback(err);
				}
			});
		},
		
		send : function(userId, noteSubject){
			var ref = this;
			this.fetchNote(userId, noteSubject, function(err, notes){
				if(!err){
					_.each(notes, function(note){
						var to = note.receipent_mail;
						var text = ref.getBody(note);
						logger.debug("Sending by sendgrid");
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
