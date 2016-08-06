var LabSession = require('../api/lab.session.js');
declare var SessionCache : any;
declare var TuxLog : any;
declare var nconf : any;
declare var Collections : any;

function getSession(user : string, userId, labId : string, callback : any) : void{
  SessionCache.get(user,labId,function(err,res){
    if(err){
      //error logged in server/imports/startup/cache.js:51
      callback(new Meteor.Error(err),null);
    }

    else if(!res){

      //TODO: get from etcd
      var session = new LabSession();
      session.init(user, userId,labId, function(err,result){
        if(err){
          TuxLog.log("warn","session init err");
          //error logged in server/imports/api/lab.session.js .init
          callback(err,null);
        }
        else{

          TuxLog.log("trace","session initialized successfully");

          //TODO: catch sessioncache.add errors, nothing would work if this doesnt after refresh/logout.
          SessionCache.add(user,labId,session);
          callback(null,result);
        }
      });
    }
    else{

      TuxLog.log("trace","got existing user session successfully");
      callback(null,{taskNo: res.lab.taskNo, system: res.env.system, taskUpdates: res.taskUpdates});
    }
  });
}

function mapTasks(labId : string,taskNo : number, callback) : any {
  //Pull tasks of lab from database
  var tasks = Collections.labs.findOne({_id : labId}).tasks;
  
  //map tasks according to frontend schema
  var finalTasks = tasks.map(function(task){
    if(task._id < taskNo){
      return {id: task._id, name: task.name, md: task.md, completed: true};
    }
    else if(task._id == taskNo){
      return{id: task._id, name: task.name, md: task.md, completed: false};
    }
    else{
      return {id: task._id, name: task.name, md: null, completed:false};
    }
  });

  //callback on mapped tasks
  callback(null,finalTasks);
}
export function prepLab(user : string, userId: string, labId : string, courseId: string, callback : any) : any{
  
  //get Session instance for user/lab	
  getSession(user, userId,labId, function(err,res){
    if(err){
      //errors logged in getSession above
      callback(err,null);
    }
    else{
      //options not to get unnecessary fields from database
      var optsp = {'fields': {
          'labfile' : 0,
          'lab_name': 0,
          'course_id': 0,
          'updated': 0,
          'disabled': 0,
          'hidden': 0
      }};

      //parse sshInfo from nconf and results
      var sshInfo = {host : nconf.get("domain_root"), pass: res.sshPass};
      var taskUpdates = res.taskUpdates;
      var system = res.system;

      TuxLog.log("trace","got all session info successfully");

      //map taskList into frontend schema
      mapTasks(labId,res.taskNo,function(err,res){
        if(err){
          //cannot have an error
          callback(err,null);
        }
       /* else{
          var labs = Collections.course_records.findOne({course_id: courseId, user_id: userId});

	  var i = labs.findIndex(function(lab){return lab._id == labId});
          
	  //check if lab exists
	  if(i < 0){
            var lab = {
	      _id: labId,
	      data: {},
	      attempted: [Date.now()],
	      tasks: res
	    }

	    //create lab record if doesn't exist
	    labs.push(lab);
	    //TODO: uncomment these, they should work...
	  //  Collections.course_records.update({course_id: courseId, user_id: userId},{$set:{labs: labs}});
	  }
          //update lab record if it exists
	  else{
            labs[i].attempted.push(Date.now());
	//    Collections.course_records.update({course_id: courseId, user_id: userId},{$set:{labs: labs}});
	  }*/
          TuxLog.log("trace","updated course_records successfully");
          callback(null,{system: system, taskList: res, taskUpdates: taskUpdates});
        //}
      });
    }
  });
}

export function verify(uId : string, labId : string, callback : any) : void{

  //renew the cache timeout
  SessionCache.renew(uId,labId);

  SessionCache.get(uId, labId, function(err,result){
    if(err){
      //err logged in server/imports/startup/cache.js:51
      callback(err,null);
    }
    else if(!result){
      TuxLog.log("warn",new Meteor.Error("Session.get returned no result for session in use"));
      callback(new Meteor.Error("Session.get returned no result for session in use"),null);
    }
    else{
      result.verify(callback);
    }
  });


}
export function next(uId : string, labId : string, courseId : string, callback : any) : void{
  SessionCache.get(uId, labId, function(err,result){
    
  if(err){
      //err logged in server/imports/startup/cache.js:51
      callback(err,null);
    }

    else if(!result){
      TuxLog.log("warn",new Meteor.Error("Session.get returned no result for session in use"));
      callback(new Meteor.Error("Session.get returned no result for session in use"));
    }
    else{
      result.next(function(err,res){
        if(err){
          //err logged in server/imports/api/lab.session.js .next
          callback(err,null);
        }
	else if(!res){
	  var taskNo = result.lab.taskNo;

	  var labs = Collections.course_records.findOne({user_id: uId, course_id: courseId}).labs;

	  var i = labs.findIndex(function(lab){ return lab._id == labId });
	  if(i < 0){
            TuxLog.log("warn",new Meteor.Error("No course record found for lab in use"));
	    callback(new Meteor.Error("No course record found for lab in use"),null);
	  }
	  else{

	    (labs[i].tasks)[(taskNo - 1)].attempted.push(Date.now());
	    labs[i].tasks[(taskNo - 1)].status = "IN_PROGRESS";
	    //TODO: uncomment this, it should work
	    //Collections.course_records.update({course_id: courseId, user_id: userId},{$set:{labs: labs}});

	  }
	}
        else{
          mapTasks(labId,res,function(err,ress){
            if(err){
              //cannot have an error
              callback(err,null);
            }
            else{ 

              var labs = Collections.course_records.findOne({user_id: uId, course_id: courseId}).labs;
	      var i = labs.findIndex(function(lab){ return lab._id == labId});
	      if(i < 0){
	        TuxLog.log("warn",new Meteor.Error("No course record found for lab in use"));
		callback(new Meteor.Error("No course record found for lab in use"),null);
	      }
	      else{
	        (labs[i].tasks)[(res - 2)].attempted.push(Date.now());

                labs[i].tasks[(taskNo - 1)].status = "IN_PROGRESS";
	        labs[i].tasks[taskNo].status = "IN_PROGRESS";

		callback(null,{taskList: ress, taskNo: res, taskUpdates:result.taskUpdates});
	      }
            }
          });
        }
      });
    }
  })
}
