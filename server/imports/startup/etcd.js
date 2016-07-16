/*
  Initializes ETCD Connection
*/
var fs = require('fs');

// Get Address
var etcd_address = ["localhost:2379"];

// Get Auth
var etcd_options;
if (nconf.get('etcd_user') !== null){
  etcd_options = {
    auth: {
     user: nconf.get('etcd_user'),
     pass: nconf.get('etcd_pass')
   }
  }
}

// Start ETCD
var Etcd = require('node-etcd');
etcd = new Etcd(etcd_address,etcd_options); 

// Create TuxLab Dir
etcd.mkdir("tuxlab", function(err){
  if(err){
   TuxLog.log("warn", err);
  }
  console.log(require('util').inspect(err, true,10));
});
