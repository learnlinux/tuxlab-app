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

  SessionCache.renew = function(userid,labid){
    return "renewed";
  }
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
          if(data && data.body && data.body.node && data.body.node.value){
            TuxLog.log("warn","Pulling session from etcd");
            var sess = new Session();
            sess.fromJson(data,function(err,res){
              callback(err,sess);
            });
          }
          else{
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
    TuxLog.log("trace","adding session to cache");
    async.series([
      function(cb){
        SessionCache._NodeCache.set(userid+'#'+labid, session, function(err, success){
          if(err){
            TuxLog.log("warn",err);
            cb(true);
          }
          else{
            TuxLog.log("trace","added session to cache successfully");
            cb(false);
          }
        });
      },
      function(cb){

        var json = {
	  taskNo: session.lab.taskNo,
	  system: session.env.system,
	  taskUpdates: session.taskUpdates,
	  user:session.user,
	  userId: session.userId,
	  labId: labid,
	  courseId: session.courseId
	};

        etcd.set('tuxlab/sessions/'+session.env.system.node_ip+ '/' + userid + '/' + labid, JSON.stringify(json), function(err){
          if(err){
	    TuxLog.log("warn","etcd.set err");
	    TuxLog.log("warn",err);
	    cb(err);
	  }
	  else{
	    cb(err);
	  }
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
