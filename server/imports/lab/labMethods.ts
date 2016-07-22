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

function mapTasks(labId : string,taskNo : number, callback) : any {
  var tasks = Collections.labs.findOne({_id : labId}).tasks;
    console.log("mapping");
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
  callback(null,finalTasks);
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
      mapTasks(labId,res.taskNo,function(err,res){
        if(err){
          callback(err,null);
        }
        else{
          console.log("calling back");
          callback(null,{sshInfo: sshInfo, taskList: res});
        }
      });
    }
  });
}

export function next(uId : string,labId : string, callback : any) : void{
  SessionCache.get(uId, labId, function(err,result){
    console.log("result.lab.taskNo: "+result.lab.taskNo);
    if(err){
      TuxLog.log("warn","Session.get Error" + err);
      callback(err,null);
    }

    else if(!result){
      TuxLog.log("warn","Session.get had no results: "+err);
    }
    else{
      result.next(function(err,res){
        if(err){
          callback(err,null);
        }
        else{
          mapTasks(labId,res,function(err,ress){
            if(err){
              callback(err,null);
            }
            else{
              callback(null,{taskList: ress, taskNo:res})
            }
          });
        }
      });
    }
  })
}
