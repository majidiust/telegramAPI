var SimpleTelegram = require('../utility/simple-telegram')
var stg = new SimpleTelegram()
var express = require('express');
var router = express.Router();


// Replace next values to your own paths
var tgBinFile  = "/home/valiolahi/tg/bin/telegram-cli"
var tgKeysFile = "/home/valiolahi/keys/telegram.pub"

// Preparing Winston logger
var winston = require('winston')
var logfile = '/home/valiolahi/loggerTest.log'
var logger;

// Define options for Date#toLocaleTimeString call we will use.
var twoDigit = '2-digit';
var options = {
  day: twoDigit,
  month: twoDigit,
  year: twoDigit,
  hour: twoDigit,
  minute: twoDigit,
  second: twoDigit
};

function formatter(args) {
  var dateTimeComponents = new Date().toLocaleTimeString('en-ES', options).split(',');
  var logMessage = '[' + dateTimeComponents[0] + dateTimeComponents[1] + '][' + args.level + '] - ' + args.message;
  return logMessage;
}

var initTelegramClient = function(binFile, keyFile){
	logger = new winston.Logger({
	    transports: [ new (winston.transports.File)({ filename: logfile
		                                        , timestamp: true
		                                        , json: false
		                                        , formatter: formatter
		                                        })
		        , new (winston.transports.Console)()
		        ]
	  })
	if(binFile)
		tgBinFile = binFile;
	if(keyFile)
		tgKeysFile = keyFile;

	stg.addLogger(logger)
	stg.create(tgBinFile, tgKeysFile)
	console.log("Engine created and started");
}

function sendTelegramMessage(req, res){
	console.log(req.body);
	var callNumber = req.body.number;
	console.log("number : " + callNumber);
	var message = req.body.message ? req.body.message : "No Message";
	try{
		stg.addContact(callNumber, callNumber, callNumber);	
		var to = callNumber + " " + callNumber;
		setTimeout(function(){
  		stg.send(to, message)}, 5000);
		res.status(200).send("Send to user successfully");
	}
	catch(ex){
		res.status(500).send(ex);
	}
}

router.route('/sendTelegramMessage').post(sendTelegramMessage);
module.exports = router;
module.exports.initTelegramClient = initTelegramClient;
