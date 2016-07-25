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
      var session = new LabSession();
      session.init(user, userId,labId, function(err,result){
        if(err){
          //error logged in server/imports/api/lab.session.js .init
          callback(err,null);
        }
        else{
          //done sync, not absolutely necessary 
          //TODO: catch sessioncache.add errors, nothing would work if this doesnt after refresh/logout.
          SessionCache.add(user,labId,session);
          callback(null,result);
        }
      });
    }
    else{
      //TODO: change this to pull from somewhere
      res.env.getPass(function(err,result){
        if(err){
          callback(err,null);
        }
        else{
          console.log(result);
          callback(null,{taskNo:res.lab.taskNo,sshPass:result});
        }
      })
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
export function prepLab(user : string,userId: string, labId : string, callback : any) : any{
  
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
      //map taskList into frontend schema
      mapTasks(labId,res.taskNo,function(err,res){
        if(err){
          //cannot have an error
          callback(err,null);
        }
        else{
          callback(null,{sshInfo: sshInfo, taskList: res});
        }
      });
    }
  });
}

export function verify(uId : string, labId : string, callback : any) : void{
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
      result.verify(function(succ){
        if(!succ){
          callback(null,false);
	}
	else{
          callback(null,true);    
	}
      })
    }
  });


}
export function next(uId : string,labId : string, callback : any) : void{
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
        else{
          mapTasks(labId,res,function(err,ress){
            if(err){
              //cannot have an error
              callback(err,null);
            }
            else{ 
              callback(null,{taskList: ress, taskNo:res});
            }
          });
        }
      });
    }
  })
}
