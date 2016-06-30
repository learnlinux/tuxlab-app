var _eval = require('eval');
var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;
var url = "mongodb://tuxlab:cQPD9wte@ds025792.mlab.com:25792/tuxlab";

var labExec = function(){
  this.env = require('./env.js');
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

labExec.prototype.init = function(user,courseId,labId){
  var slf = this;
  this.env.setUser(user);
  labMongo.importLab(courseId,labId,function(lab){
    if(!slf.check(lab.file)){
      console.log("labFile corrupt");
    }
    else{
      slf.tuxlab = eval(lab.file);
      console.log("success!");
      console.log(slf.tuxlab);
    }
  });
}

labExec.prototype.parseTasks = function(){
  return this.tuxlab.taskList.map(function(task){ return {title: task.title,
							  markdown: task.markdown,
							  }; });
}

labExec.prototype.start = function(callback){
  var slf = this;
  this.tuxlab.setup(this.env)
    .then(function(){ slf.tuxlab.tasks(this.env); })
    var tasks = this.tuxlab.tasks(this.env);
  if(!this.tuxlab.currentTask.next) throw "Tasks not properly chained";
  this.tuxlab.currentTask = this.tuxlab.currentTask.next;
  this.currentTask.sFn().then(function(){ callback(slf.parseTasks); });
}

labExec.prototype.next = function(callback){
  var slf = this;
  if(this.tuxlab.currentTask.isLast()) throw "cannot call next on last task";
  currentTask.vFn().then(function(){ slf.tuxlab.currentTask = slf.tuxlab.currentTask.next;
				     slf.tuxlab.currentTask.sFn().then(function(){
					callback(slf.tuxlab.currentTask);})},
			 function(){ /*handle the error*/ }); 
}

labExec.prototype.end = function(){
//same as next, will change after testing
}

module.exports = new labExec();
