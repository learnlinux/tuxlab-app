var LabSession = require('../api/lab.session.js');
declare var SessionCache : any;
declare var TuxLog : any;
declare var nconf : any;
declare var Collections : any;

function getSession(user : string, labId : string, callback : any) : void{
  SessionCache.get(user,labId,function(err,res){
    if(err){
      TuxLog.log("warn","SessionCache.get :"+err);
      callback(new Meteor.Error("Internal Service Error"),null);
    }
    else if(!res){
      TuxLog.log("warn","no res");
      var session = new LabSession();
      session.init(user, labId, function(err,result){
        if(err){
          TuxLog.log("warn","session init: "+err);
          callback(err,null);
        }
        else{
          SessionCache.add(user,labId,session,function(err){ 
            TuxLog.log("warn",err);
            //callback(null,result);
          });
          callback(null,result);
        }
      });
    }
    else{
      TuxLog.log("warn","res initialized");
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
export function prepLab(user : string, labId : string, callback : any) : any{
  TuxLog.log("warn","prepLab");
  getSession(user, labId, function(err,res){
    if(err){
      TuxLog.log("warn","getSession err: "+err);
      callback(new Meteor.Error("Internal Service Error"),null);
    }
    else{

      var optsp = {'fields': {
          'labfile' : 0,
          'lab_name': 0,
          'course_id': 0,
          'updated': 0,
          'disabled': 0,
          'hidden': 0
      }};
      var sshInfo = {host : nconf.get("domain_root"), pass: res.sshPass};
      var tasks = Collections.labs.findOne({_id: labId}).tasks;
      var finalTasks = tasks.map(function(task){
        if(task._id <= res.taskNo){
          return {title: task.name, md: task.md}; 
        }
        else{
          return {title: task.name, md: null};
        }
      });
      callback(null,{sshInfo: sshInfo, taskList: finalTasks});
    }
  });
}
