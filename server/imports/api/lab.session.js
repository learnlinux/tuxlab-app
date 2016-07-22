/// <reference path="./lab.exec.d.ts" />
var lab = require('./lab.js');
var session = function(){
};

session.prototype.env = null;
session.prototype.lab = null;
/* init: pulls labFile and initializes session object from it
 */
session.prototype.init = function(user,labId,callback){
  var slf = this;
  this.env = require('./lab.env.js');
  this.env.setUser(user);
  
  // Get Metadata from Database
  var lab_data = Collections.labs.findOne({_id: labId}, {fields: {'labfile' : 0}});
  if(!lab_data || lab_data.length < 0){
    TuxLog.log("warn",new Error("Lab not found"));
    callback(new Error("Lab Not Found."), null);
  }
  else{
    // Get Course Metadata
    var course = Collections.courses.findOne({_id: lab_data.course_id}, {fields: {'labs' : 1 }});

    // Format LabFile Cache URL
    var labfile_id = labId + "#" + lab_data.updated;

    // Check Cache for LabFile Object
    LabCache.get(labfile_id, function(err, value){
      if(err){
	TuxLog.log("warn",err);
        callback(err, null);
      }
      else if(typeof value === "undefined"){
        // Get LabFile from Database
        var labfile_data = Collections.labs.findOne({_id: labId}, {fields : {'field' : 0}});
        var Lab = eval(labfile_data.labfile);
        Lab.taskNo = 0;
        slf.lab = Lab;

        // Cache LabFile -runs sync, not central to anything
        LabCache.set(labfile_id, slf.lab, function(err, success){
          if(err || !success){
            TuxLog.log("warn", err);
          }
        });
       
	slf.start(function(err){
	  if(err){
            //err logged in slf.start
	    callback(err,null);
	  }
	  else{
	    slf.env.getPass(function(err,res){
              if(err){
		//TODO: err log in server/imports/api/lab.env.js:
		//TODO: separate streams in env.js
                callback(err,null);
              }
              else{
                slf.lab.pass = res;
                callback(null,{taskNo: slf.lab.taskNo,sshPass: res});
              }
            });
	  }
	});
      }     
      else{
        // Get LabFile from Cache
        var Lab = value;
        Lab.taskNo = 0;
        slf.lab = Lab;
        slf.start(function(err){
          if(err){
            callback(err,null);
          }
          else{
	    slf.env.getPass(function(err,res){
              if(err){
                //TODO : same as above
                callback(err,null);
              }
              else{
                //slf.lab.pass = res;
                callback(null,{taskNo: slf.lab.taskNo,sshPass: res});
              }
            });
          }
	});
      }
    });
  }
}
/* start: runs setup and moves task header to first task
 * runs callback(err) on err if there is an error,
 * (null) no error
 */
session.prototype.start = function(callback){
  var slf = this;
  this.lab.taskNo = 1;
  this.lab.setup(this.env)
    .then(function(){ 
        return new Promise(function(resolve,reject){
          try{
            slf.lab.tasks(this.env);
            resolve();
          }
          catch(e){
            reject(e);
          }
        });
      },
      function(err){
        TuxLog.log("warn",err);
        callback(err)
      }
    )    
    .then(function(){
        console.log("resolved");
        if(!slf.lab.currentTask.next){
          TuxLog.log('warn',new Error('labfile tasks not properly chained at start'));
          callback(new Error("labfile task chaining error"));
        }

        else{
          slf.lab.currentTask = slf.lab.currentTask.next;
          slf.lab.currentTask.setupFn(slf.env)
            .then(callback(null),function(err){
		    TuxLog.log("warn",err);
		    callback(err)});
        }
      }, 
      function(){
        TuxLog.log("warn","error setting up task1");
        callback("Task1 setup error");
      });
}

/* next: verifies that task is completed
 * moves on to next task and runs callback(null,parseTasks) if completed
 * runs callback(err,null) -err from verify- if not
 */
session.prototype.next = function(callback){
  var slf = this;

  //check if currentTask is the last task
  if(this.lab.currentTask.isLast()){
    TuxLog.log("warn",new Error("trying to call nextTask on last task"));
    callback(new Error("trying to call next on last task"),null);
  }

  //if it is not the last task...
  else{
    slf.lab.currentTask.verifyFn(slf.env)
      .then(function(){
         slf.lab.currentTask = slf.lab.currentTask.next;
         slf.lab.currentTask.setupFn(slf.env)
           .then(function(){
              slf.lab.taskNo += 1;
	      callback(null,slf.lab.taskNo);
              },
              function(err){
                TuxLog.log("warn",err);
                callback(err,null);
              });
        },
        function(err){
          TuxLog.log("warn",err);
          callback(err,null);
        });
  }
}

/* end: verifies that last task is completed
 * runs callback on (null,done) if verify runs correctly
 * runs callback (err, null) if not
 */
session.prototype.end = function(callback){
  var slf = this;
  if(!this.lab.currentTask.isLast()){
    TuxLog.log("debug","trying to call end on a non-last task");
    callback("Internal error",null); //TODO: should we allow end on non-last tasks? @Derek
  }
  this.lab.currentTask.vFn().then(function(){
                                       callback(null,"done");
                                     },
                                     function(){
				       callback(err,null);
                                     });
}

module.exports = session;
