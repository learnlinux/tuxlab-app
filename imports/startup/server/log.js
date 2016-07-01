/*
  Winston Logger for TuxLab-app
*/
var winston = require('winston');
TuxLog = new (winston.Logger)({
  transports: [
     new (winston.transports.Console)(),
     new (winston.transports.File)({ filename: 'tuxlab.log' }) //Replace with GrayLog
   ]
});
