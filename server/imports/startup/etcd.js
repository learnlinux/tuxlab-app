/*
  Initializes ETCD Connection
*/

// Get Address
var etcd_address = '127.0.0.1:2379';

// Get Auth
var etcd_auth;
if (nconf.get('etcd_user') == null){
  etcd_auth = {
    user: nconf.get('etcd_user'),
    pass: nconf.get('etcd_pass')
  }
}

// Options
var etcd_options = {
    auth: etcd_auth
}

// Start ETCD
var Etcd = require('node-etcd');
etcd = new Etcd(etcd_address,etcd_options)

// Create TuxLab Dir
etcd.mkdir("tuxlab", function(err){
  if(err){
   TuxLog.log("warn", err);
  }
});
