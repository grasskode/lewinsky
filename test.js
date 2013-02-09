var Twilio = require('twilio-js');
Twilio.AccountSid = "AC4b2b6a51bc985aead8bbfee6edbfaa7e";
Twilio.AuthToken  = "c10d8aa430d5cef0b16986b9da748ed8";

//Twilio.Call.create({to: "+919945657973", from: "+12243658564", url: "http://4um7.localtunnel.com/call"}, function(err,res) {
//	if(err){
//		console.log(err);
//	}else
//		console.log('HOLY MOLY! PHONES ARE RINGING');
//});
//
//Twilio.SMS.create({to: "+919945657973", from: "+12243658564", url: "http://4um7.localtunnel.com/sms", body : "Heeloo"}, function(err,res) {
//	if(err){
//		console.log(err);
//	}else
//		console.log('You have a new message!');
//});

var SendGrid = require('sendgrid').SendGrid;
var sendgrid = new SendGrid('guptakaran11', 'mypapass');
sendgrid.send({
	to: 'iitr.sourabh@gmail.com',
	from: 'sourabh.agarwal@flipkart.com',
	subject: 'Hello World',
	text: 'My first email through SendGrid'
}, function(success, message) {
	if (!success) {
		console.log(message);
	}
});


var schedule = require('node-schedule');
var RecurrenceRule = schedule.RecurrenceRule;
var cron = '1-10,15,18-20 4-6,8,10-12 3-5,9,12-15 * * 2012,2013,2014';
cron.match(/^[0-9-,\*]*\s[0-9-,\*]*\s[0-9-,\*]*[9]+[0-9-,\*]*\s[0-9-,\*]*\s[0-9-,\*]*\s[0-9-,\*]*2013[0-9-,\*]*|$/g);

// ^[-0-9,\*]* [-0-9,\*]* [-0-9,\*]*[9]+[-0-9,\*]* [-0-9,\*]* [-0-9,\*]* [-0-9,\*]*[[:<:]]2013[[:>:]][-0-9,\*]*
var r = RecurrenceRule.fromCronString(cron);
r.nextInvocationDate();