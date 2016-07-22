
//variable declarations
declare var Collections : any;
declare var TuxLog : any;
declare var SessionCache : any;
declare var nconf : any;

//import session constructor
var LabSession = require('../api/lab.session.js');

//import sync Meteor methods
import{ prepLab, next } from './labMethods.ts';

Meteor.methods({
  /**prepareLab: prepares a labExec object for the current user
   * takes the id of the lab and a callback as parameter
   * callback: (err,pass)
   * implement loading wheel, md fetch, course record create in callback
   */
  'prepareLab': function(labId : string){
    TuxLog.log("warn","here");
    var uId = Meteor.user().profile.nickname;
    var sessionAsync = Meteor.wrapAsync(prepLab);
    try{
      var res = sessionAsync(uId,labId);
      return res;
    }
    catch(e){
      TuxLog.log("warn",e);
      throw new Meteor.Error(e);
    }
  },
  'nextTask': function(labId : string){
    /**session.next(cb)
     * cb(err,res) implement loading wheel here
     * call nextTask callback(err,res) in cb
     * change task markdown -frontend
     * change course records if passed
     */
    
    var uId = Meteor.user().profile.nickname;
    var nextAsync = Meteor.wrapAsync(next);
    try{
      var res = nextAsync(uId,labId);
      return res;
    }
    catch(e){
      TuxLog.log(e);
      throw new Meteor.Error("Internal Service Error");
    }
  },
  'endLab': function(labId : string){
    /**session.end(cb)
     * cb(err,res)
     * call endLab callback(err,res) in cb
     * change course records
     * session.env.deleteRecords deletes etcd records,
     * session.env.removeVm removes virtual machines.
     * remove all vms and deleterecords after lab is completed for good. -highly optional
     */
    var uId = Meteor.userId();
    SessionCache.get(uId,labId,function(err,res){
      if(err){
        TuxLog.log("warn",err);
	throw new Meteor.Error("Internal Service Error");
      }
      else if(!res){
        TuxLog.log("warn",new Meteor.Error("SessionCache.get failed to return a session instance"));
	throw new Meteor.Error("Internal Service Error");
      }
      else{
        var endAsync = Meteor.wrapAsync(res.end,res);
	try{
	  var result = endAsync();
	  return "success" //TODO: @Derek what to return here?
	}
	catch(e){
	  TuxLog.log("warn",e);
	  throw new Meteor.Error("Internal Service Error");
	}
      }
    });
  }
});
