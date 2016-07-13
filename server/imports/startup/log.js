/*
  Winston Logger for TuxLab-app
*/
var winston = require('winston');
var nconf = require('nconf');

var log_collection_name = nconf.get('mongo_log_collection');
logs_collection = new Mongo.Collection(log_collection_name);

TuxLog = new (winston.Logger)({
  transports: [
     new (winston.transports.Console)(),
   ]
});
