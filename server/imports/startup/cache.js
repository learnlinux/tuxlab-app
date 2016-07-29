/*
  Creates Session and Lab Caches
*/
var async = require('async');

var NodeCache = require('node-cache');
var Session = require('../api/lab.session.js');

// Lab Cache
  LabCache = new NodeCache({
    stdTTL: nconf.get('labvm_idle_timeout'),
    useClones: false,
    errorOnMissing: false
  });

// Session Cache
  SessionCache = {};
  var etcd_sessions_url = "/tuxlab/sessions";

  // Create Memory Cache
  SessionCache._NodeCache = new NodeCache({
    stdTTL: nconf.get('labvm_idle_timeout'),
    useClones: false,
    errorOnMissing: false
  })

  // Create ETCD Cache
  async.series([
    function(callback){
      etcd.mkdir('tuxlab', function(err){
        if(err && err.errorCode !== 105 && err.errorCode !== 102)
          callback(err);
      });
    },
    function(callback){
      etcd.mkdir('tuxlab/sessions', function(err){
        if(err && err.errorCode !== 105 && err.errorCode !== 102)
          callback(err);
      });
    }
  ], function(err){
    if(err){
      TuxLog.log('warn', err);
    }
  });

  /*
    Gets a session from the local memory cache or ETCD
  */
  SessionCache.get = function(userid, labid, callback){
    SessionCache._NodeCache.get(userid+'#'+labid, function(err, value){
      if(err){
        TuxLog.log('warn', "SessionCache NodeCache Error.");
        callback(err,null);
      }
      else if(value !== undefined){
        TuxLog.log("warn","it is here");
        callback(null,value);
      }
      else{
        try{
          var data = etcd.getSync('/tuxlab/sessions/'+userid+'/'+labid);
          console.log("DATA",data);
          if(data.body.node.value){
            var sess = new Session();
            sess.fromJson(data,function(err,res){
              callback(err,sess);
            });
          }
          else{
            console.log("YAAAAY");
            callback(null,null);
          }
        }
        catch(e){
          TuxLog.log("warn",e);
          callback(null,null);
        }
      }
    });
  }

  /*
    Adds a Session from the Cache
    userid - user of session
    labid - lab user opens
    session - session object to be stored
    callback(success) - returns boolean if success
  */
  SessionCache.add = function(userid, labid, session){
    console.log("in add");
    async.series([
      function(cb){
        SessionCache._NodeCache.set(userid+'#'+labid, session, function(err, success){
          if(err){
            TuxLog.log("warn",err);
            cb(true);
          }
          else{
            cb(false);
          }
        });
      },
      function(cb){
        //TODO @cemersoz to_data method
        console.log("about to set");
        var json = {
	  taskNo: session.lab.taskNo,
	  taskUpdates: session.taskUpdates,
	  pass: session.pass,
	  user:session.user,
	  userId: session.userId,
	  labId: labid,
	  courseId: session.courseId
	};
        etcd.set('tuxlab/sessions/'+userid+'/'+labid, JSON.stringify(json), function(err){
          TuxLog.log("warn","here");
          cb(err);
        });
      }
    ], function(err){
      if(err){
        TuxLog.log('warn',err);
      }
    });
  }

  /*
    Renews Session Variables in the Cache
  */
  SessionCache.renew = function(userid, labid, callback){
    SessionCache.ttl(userid + '#' + labid, nconf.get('labvm_idle_timeout'), callback);
  }

  /*
    Removes a Session from the Cache
  */
  SessionCache.remove = function(userid, labid, callback){
    SessionCache.del(userid + "#" + labid, callback);
  }

  /*
    Handle Expiration
    Delete from ETCD
  */
  SessionCache._NodeCache.on("del", function(key, value){
    //TODO @cemersoz handle expiration of local machine things
  });
