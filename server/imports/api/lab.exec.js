var _eval = require('eval');

var labExec = function(){
  this.env = require('./lab.env.js');
};

labExec.prototype.check = function(str){
  if(!str) { return false; }
    try {
      var tux = eval(str);
    }
    catch(e) {
      console.log("compile error: "+e);
      return false;
    }
    var tuxOrig = require('./tuxlab.js');
    return tux.setup &&
           tux.tasks &&
           tux.init &&
           tux.newTask &&
           (typeof tux.setup === 'function') &&
           (typeof tux.tasks === 'function') &&
           (tux.init.toString() === tuxOrig.init.toString()) &&
           (tux.newTask.toString() === tuxOrig.newTask.toString());
}

/* init: pulls labFile and initializes labExec object from it
 */
labExec.prototype.init = function(user,labId,callback){
  var slf = this;
  this.env.setUser(user);

  // Get Metadata from Database
  slf.lab = Collections.labs.findOne({_id: lab_id}, {fields: {'file' : 0}}).fetch();
  if(lab.length < 0){
    callback(new Error("Lab Not Found.", null));
  }
  else{

    // Get Course Metadata
    slf.course = Collections.courses.findOne({_id: lab.course_id}, {fields: {'labs' : 1 }}).fetch();

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
        slf.tuxlab = _eval(lab.labfile);

        // Cache LabFile
        LabCache.set(labfile_id, slf.tuxlab, function(err, success){
          if(err || !success){
            TuxLog.log('warn', err);
          }
        });

        slf.tuxlab.taskNo = 0;
        callback(null, lab.tasks);
      }
      else{
        // Get LabFile from Cache
        slf.tuxlab.taskNo = 0;
        slf.tuxlab = value;
        callback(null, lab.tasks);
      }
    });
  }
}

labExec.prototype.parseTasks = function(){
  var slf = this;
  return this.tuxlab.taskList.map(function(task,i){
    if(i <= slf.tuxlab.taskNo){
      return {title: task.title, markdown: task.markdown};
    }
    return {title: task.title, markdown: null};
  });
}

/* start: runs setup and moves task header to first task
 * runs callback(err,res) on err if there is an error,
 * (null,parseTasks) no error
 */
labExec.prototype.start = function(callback){
  var slf = this;
  this.tuxlab.taskNo = 1;
  this.tuxlab.setup(this.env)
    .then(function(){ slf.tuxlab.tasks(this.env); })
    var tasks = this.tuxlab.tasks(this.env);
  if(!this.tuxlab.currentTask.next){
    TuxLog.log('labfile_error','labfile tasks not properly chained at start');
    callback("Internal error",null);
  }
  this.tuxlab.currentTask = this.tuxlab.currentTask.next;
  this.currentTask.sFn().then(function(){ callback(null,slf.parseTasks(0)); });
}

/* next: verifies that task is completed
 * moves on to next task and runs callback(null,parseTasks) if completed
 * runs callback(err,null) -err from verify- if not
 */
labExec.prototype.next = function(callback){
  var slf = this;
  if(this.tuxlab.currentTask.isLast()){
    TuxLog.log("debug","trying to call nextTask on last task");
    callback("Internal error",null);
  }
  this.tuxlabcurrentTask.vFn().then(function(){
                           slf.tuxlab.currentTask = slf.tuxlab.currentTask.next;
                           slf.tuxlab.currentTask.sFn()
                             .then(function(){
                               slf.tuxLab.taskNo += 1;
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
labExec.prototype.end = function(callback){
  var slf = this;
  if(!this.tuxlab.currentTask.isLast()){
    TuxLog.log("debug","trying to call end on a non-last task");
    callback("Internal error",null); //TODO: should we allow end on non-last tasks? @Derek
  }
  this.tuxlab.currentTask.vFn().then(function(){
                                       callback(null,"done");
                                     },
                                     function(){
				       callback(err,null);
                                     });
}

module.exports = new labExec();
