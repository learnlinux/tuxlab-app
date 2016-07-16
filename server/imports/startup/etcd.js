/*
  Initializes ETCD Connection
*/

// Get Address
var etcd_address = 'localhost:2379';

// Get Auth
var etcd_auth = {
  user: nconf.get('etcd_user'),
  password: nconf.get('etcd_pass')
}

// Start ETCD
var Etcd = require('node-etcd');
etcd = new Etcd(etcd_address,etcd_auth)

// Create TuxLab Dir
    etcd.mkdir("tuxlab", function(err){
        if(err){
          TuxLog.log("warn", err);
        }
    });
