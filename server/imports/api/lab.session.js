/// <reference path="./lab.exec.d.ts" />
//require session submodules
var lab = require('./lab.js');
var student = require('./lab.student.js');
var env = require('./lab.env.js');



//labCache.get wrapper

function getLab(id, callback){
  var lab_data = Collections.labs.findOne({_id: id});

  if(!lab_data || lab_data.length < 0){
    TuxLog.log("warn",new Error("Lab not found"));
    callback(new Error("Lab Not Found."), null);
  }

  var labcache_id = id + "#" + lab_data.updated;
  LabCache.get(labcache_id,function(err,value){
    if(err){
      TuxLog.log("warn",err);
      callback(err,null);
    }
    else if(!value){
      var file = lab_data.file;

      var Lab = eval(file);
      LabCache.set(labcache_id,Lab,function(err,res){
        if(err){
	  TuxLog.log("warn",err);
	}
      });
      callback(null,Lab);
    }
    else{
      callback(null,value);
    }
  });
}

//constructor
var session = function(){
};

//define session fields
session.prototype.env = null;
session.prototype.lab = null;
session.prototype.student = null;
session.prototype.pass = null;
session.prototype.started = false;
session.prototype.courseId = null;
session.prototype.user = null;
session.prototype.userId = null;

session.prototype.taskUpdates = [];


session.prototype.fromJson = function(data, callback){
  //set session fields
  this.user = data.user;
  this.courseId = data.courseId;
  this.pass = data.pass;
  this.userId = data.userId;

  this.env = new env();
  this.env.setUser(data.user);
  this.taskUpdates = data.taskUpdates;

  this.student = new student(this,data.userId,data.labId,data.courseId);

  getLab(data.labId,function(err,lab){
    if(err){
      callback(err,null);
    }
    else{
      this.lab = lab;
      callback(null,null);
    }
  });

}
session.prototype.changeStarted = function(){
  this.started = true;
  console.log(this.started);
}
/* init: pulls labFile and initializes session object from it
 */
session.prototype.init = function(user,userId,labId,callback){
  var slf = this;
  
  //set session fields;
  this.user = user;
  this.userId = userId;

  this.env = new env();
  this.env.setUser(user);
  // Get Metadata from Database
  var lab_data = Collections.labs.findOne({_id: labId}, {fields: {'labfile' : 0}});
  
  var courseId = lab_data.course_id;

  this.courseId = courseId;

  //initialize student object
  this.student = new student(this, userId,labId,courseId);

  if(!lab_data || lab_data.length < 0){
    TuxLog.log("warn",new Error("Lab not found"));
    callback(new Error("Lab Not Found."), null);
  }

  else{
    // Get Course Metadata
    var course = Collections.courses.findOne({_id: lab_data.course_id}, {fields: {'labs' : 1 }});

    getLab(labId,function(err,lab){
      if(err){
        callback(err,null);
      }
      else if(!slf.env.system.password){
        slf.lab = lab;
	slf.start(function(err){
	  if(err){
            //err logged in slf.start
	    callback(err,null);
	  }
	  else{
	    slf.env.getPass(function(err,res){
	      if(err){
	        callback(err,null);
	      }
	      else{
		callback(null,{system: slf.env.system,taskNo: slf.lab.taskNo});
	      }
	    });
	  }
	});
      }
      else{
        callback(null,{system: slf.env.system, taskNo: slf.lab.taskNo});
      }
    })
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
            slf.lab.tasks();
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
        if(!slf.lab.currentTask.next){
          TuxLog.log('warn',new Error('labfile tasks not properly chained at start'));
          callback(new Error("labfile task chaining error"));
        }

        else{
          slf.lab.currentTask = slf.lab.currentTask.next;
          slf.lab.currentTask.setupFn(slf.env,slf.student)
            .then(callback(null),function(err){
		    TuxLog.log("warn",err);
		    callback(err)});
        }
      }, 
      function(){
        TuxLog.log("warn","error setting up task1");
        callback(new Error("Task1 setup error"));
      });
}


session.prototype.verify = function(callback){
  var slf = this;
  slf.lab.currentTask.verifyFn(slf.env,slf.student)
    .then(callback({verified: true, taskUpdates: slf.taskUpdates}),callback({verified: false,taskUpdates: slf.taskUpdates}));
  
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
    slf.lab.currentTask.verifyFn(slf.env,slf.student)
      .then(function(){
         slf.lab.currentTask = slf.lab.currentTask.next;
         slf.lab.currentTask.setupFn(slf.env,slf.student)
           .then(function(){
              slf.lab.taskNo += 1;
	      callback(null,{taskNo: slf.lab.taskNo,taskUpdates: slf.taskUpdates});
              },
              function(err){
                TuxLog.log("warn",err);
                callback(err,null);
              });
        },
        function(err){
          callback(null,null);
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
    TuxLog.log("debug",new Error("trying to call end on a non-last task"));
    callback(new Error("Internal error"),null); 
  }
  this.lab.currentTask.vFn().then(function(){
                                       callback(null,"done");
                                     },
                                     function(){
				       callback(err,null);
                                     });
}

module.exports = session;
