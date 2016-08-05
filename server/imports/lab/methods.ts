
//variable declarations
declare var Collections : any;
declare var TuxLog : any;
declare var SessionCache : any;
declare var nconf : any;
declare var _ : any;

//import session constructor
var LabSession = require('../api/lab.session.js');

//import sync Meteor methods
import{ prepLab, next, verify } from './labMethods.ts';

import{ markdown_editor } from './export_markdown.ts';
Meteor.methods({

   /**prepareLab: prepares a labExec object for the current user
   * takes the id of the lab and a callback as parameter
   * callback: (err,pass)
   * implement loading wheel, md fetch, course record create in callback
   */
  'prepareLab': function(labId : string){
 
    TuxLog.log("trace","preparing lab");

    // Meteor.user().sessions.push({labId: labId,started: Date.now()});

//    Collections.users.update({_id: Meteor.userId()},{$set:{sessions: this.user.sessions}});
    //get course Id
    var courseId = Collections.labs.findOne({_id: labId}).course_id;

    //get user information
    var user = Meteor.user().profile.nickname;
    var uId = Meteor.userId();

    //wrap sync functions w Meteor.wrapAsync
    var sessionAsync = Meteor.wrapAsync(prepLab);

    try{
      var res = sessionAsync(user,uId,labId,courseId);
      return res;
    }
    catch(e){
      //all errors are logged in server/imports/lab/labMethods.ts
      throw new Meteor.Error("Internal Error","Error while preparing lab");
    }
  },

  'verifyTask' : function(labId : string){
    /**session.verify(cb)
     */

    //get user nick
    var uId = Meteor.user().profile.nickname;

    //wrap sync functions
    var verifyAsync = Meteor.wrapAsync(verify);


    try{
      var res = verifyAsync(uId,labId); //true if passed, false if not
      return res;
    }
    catch(e){
      //this is an actual -nonverify- error
      //all errors are logged in server/imports/lab/labMethods.ts
      throw new Meteor.Error("Internal Error","Error while verifying task");
    }
  },

  //TODO: add verify button disappear on failure.
  'nextTask': function(labId : string){
    /**session.next(cb)
     * change course records if passed
     */

    //get user nick
    var uId = Meteor.user().profile.nickname;
    
    var courseId = Collections.labs.findOne({_id: labId}).course_id;
    //wrap sync functions
    var nextAsync = Meteor.wrapAsync(next);

    try{
      var res = nextAsync(uId,labId,courseId);
      return res;
    }
    catch(e){
      //all errors are logged in server/imports/lab/labMethods.ts
      throw new Meteor.Error("Internal Error","Error while moving to the next task");
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
  },

  'exportLab': function(lab_id){
     var lab = Collections.labs.findOne({_id: lab_id});

     var tasks = lab.tasks.map(function(task){
       var l = {};
       l[task.name] = task.markdown;
     })

     var tasks_object = tasks.reduce(_.extend,{});
				    
     var result_lab = markdown_editor(lab,tasks_object);  

     return result_lab;
  },

  'getLastLab' : function(){
     var sessions = Collections.users.findOne({_id: Meteor.userId()}).sessions;
     
     var labId = sessions.reduce(function(total,current){
       if(current.started < total){
         return current;
       }
       return total;
     },Date.now()+100);

     var courseId = Collections.labs.findOne({_id: labId}).course_id;

     return {labId: labId, courseId: courseId};
  }
});
