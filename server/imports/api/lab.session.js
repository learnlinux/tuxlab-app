/// <reference path="./lab.exec.d.ts" />
var _eval = require('eval');

var session = function(){
  this.env = require('./lab.env.js');
};


session.prototype.env = null;
session.prototype.lab = null;
/* init: pulls labFile and initializes session object from it
 */
session.prototype.init = function(user,labId,callback){
  var slf = this;
  this.env.setUser(user);

  // Get Metadata from Database
  var lab = Collections.labs.findOne({_id: labId}, {fields: {'file' : 0}});
  if(!lab || lab.length < 0){
    callback(new Error("Lab Not Found.", null));
  }
  else{

    // Get Course Metadata
    var course = Collections.courses.findOne({_id: lab.course_id}, {fields: {'labs' : 1 }}).fetch();

    // Format LabFile Cache URL
    var labfile_id = labId + "#" + lab.updated;

    // Check Cache for LabFile Object
    LabCache.get(labfile_id, function(err, value){
      if(err){
        callback("TuxLab Exec Error.", null);
      }
      else if(typeof value === "undefined"){
        // Get LabFile from Database
        var labfile_data = Collections.labs.findOne({_id: lab_id}, {fields : {'field' : 0}}).fetch();
        slf.lab = _eval(lab.labfile);

        // Cache LabFile
        LabCache.set(labfile_id, slf.lab, function(err, success){
          if(err || !success){
            TuxLog.log('warn', err);
          }
        });

        slf.lab.taskNo = 0;
        callback(null, lab.tasks);
      }
      else{
        // Get LabFile from Cache
        slf.lab.taskNo = 0;
        slf.lab = value;
        callback(null, lab.tasks);
      }
    });
  }
}

session.prototype.parseTasks = function(){
  var slf = this;
  return this.lab.taskList.map(function(task,i){
    if(i <= slf.lab.taskNo){
      return {title: task.title, markdown: task.markdown};
    }
    return {title: task.title, markdown: null};
  });
}

/* start: runs setup and moves task header to first task
 * runs callback(err,res) on err if there is an error,
 * (null,parseTasks) no error
 */
session.prototype.start = function(callback){
  var slf = this;
  this.lab.taskNo = 1;
  this.lab.setup(this.env)
    .then(function(){ slf.lab.tasks(this.env); })
    var tasks = this.lab.tasks(this.env);
  if(!this.lab.currentTask.next){
    TuxLog.log('labfile_error','labfile tasks not properly chained at start');
    callback("Internal error",null);
  }
  this.lab.currentTask = this.lab.currentTask.next;
  this.currentTask.sFn().then(function(){ callback(null,slf.parseTasks(0)); });
}

/* next: verifies that task is completed
 * moves on to next task and runs callback(null,parseTasks) if completed
 * runs callback(err,null) -err from verify- if not
 */
session.prototype.next = function(callback){
  var slf = this;
  if(this.lab.currentTask.isLast()){
    TuxLog.log("debug","trying to call nextTask on last task");
    callback("Internal error",null);
  }
  this.lab.currentTask.vFn().then(function(){
                           slf.lab.currentTask = slf.lab.currentTask.next;
                           slf.lab.currentTask.sFn()
                             .then(function(){
                               slf.lab.taskNo += 1;
			       callback(null,slf.parseTasks());})
                         },
			 function(err){
			   callback(err,null);
			 });
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

module.exports = new session();
