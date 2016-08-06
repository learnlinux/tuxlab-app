
//variable declarations
declare var Collections : any;
declare var TuxLog : any;
declare var SessionCache : any;
declare var nconf : any;
declare var _ : any;
declare var async : any;

import{ Roles } from '../../../collections/users.ts';
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

    (<any>Meteor.user()).sessions.push({labId: labId,started: Date.now()});

    Meteor.users.update({_id: Meteor.userId()},{$set:{sessions: this.user.sessions}});
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
     var sessions = (<any>Meteor.user()).sessions;
     
     var labId = sessions.reduce(function(total,current){
       if(current.started < total){
         return current;
       }
       return total;
     },Date.now()+100);

     var courseId = Collections.labs.findOne({_id: labId}).course_id;

     return {labId: labId, courseId: courseId};
  },
  
  'addInstructor' : function(course_id, instructor_id){

    if(!(Roles.isAdministratorFor(course_id, Meteor.userId()) || Roles.isInstructorFor(course_id,instructor_id))){
      throw new Meteor.Error("only administrators or instructors can modify instructors");
    }
    else{
      var inst : any = Meteor.users.findOne({_id: instructor_id});

      if(!inst){
        throw new Meteor.Error("no user found with given id");
      }
      else{
        inst.roles.instructor.push(course_id);

        Meteor.users.update({id: instructor_id},{$set: {roles: inst.roles}});

        var instructor = {
          name: inst.profile.first_name + " "+ inst.profile.last_name,
	  id: instructor_id
        };

        Collections.courses.update({_id: course_id},{$push:{instructors: instructor}});
      }
    }
  },

  'removeInstructor' : function(course_id, instructor_id){
    
    if(!(Roles.isAdministratorFor(course_id, Meteor.userId()) || Roles.isInstructorFor(course_id, instructor_id))){
      throw new Meteor.Error("only administrators or instructors can modify instructors");
    }
    else{
      var inst : any = Meteor.users.findOne({_id: instructor_id});

      if(!inst){
        throw new Meteor.Error("no user found with given id");
      }
      else{
        Collections.courses.update({_id: course_id},{$pull:{instructors: {id: instructor_id}}});

	inst.roles.instructor.delete(inst.roles.instructor.indexOf(course_id));
	Meteor.users.update({_id: instructor_id},{$set: {roles: inst.roles}});
      }
    }
  },

  'createCourse' : function(course_name, userId, course_number){
    if(!Roles.isGlobalAdministrator(Meteor.userId())){
      throw new Meteor.Error("only administrators can create courses")
    }
    else{
      var user = Meteor.users.findOne({_id: userId});
      if(!user){
        throw new Meteor.Error("the instructor id does not match that of a registered user");
      }
      else{
        if(!course_number){
	  course_number = "";
	}
	var course = {
	  course_number: course_number,
	  course_name: course_name,
	}
        var courseId = Collections.courses.insert(course);

	Meteor.call('addInstructor',courseId, userId);
      }
    }  
  },

  'deleteCourse' : function(course_id){
    var course = Collections.courses.findOne({_id: course_id});
    
    var instructors = course.instructors;

    async.map(instructors,function(instructor){
      Meteor.call('removeInstructor',course_id,instructor.id);
    });

  }
});
