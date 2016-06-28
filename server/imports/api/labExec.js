var _eval = require('eval');
var mongo = require('mongodb');
var mongoClient = mongo.MongoClient;
var url = "mongodb://tuxlab:cQPD9wte@ds025792.mlab.com:25792/tuxlab";

var labExec = function(){
  this.env = require('./env.js');
};

labExec.prototype.mongo = mongo;
labExec.prototype.mongoClient = mongoClient;

labExec.prototype.check = function(str){
  var tux = eval(str);
  var tuxOrig = require('./tuxlab.js');
  return (typeof tux.setup === 'function') &&
         (typeof tux.tasks === 'function') &&
         (tux.init.toString() === tuxOrig.init.toString()) &&
         (tux.newTask.toString() === tuxOrig.newTask.toString());
}

labExec.prototype.init = function(courseId,labId){
  var slf = this;
  mongoClient.connect(url, function(err,db){
    if(err){
      console.log("you fucked up");
    }
    else{
      var collection = db.collection('courses');
      collection.find({_id: courseId}).toArray(function(err,res){
        if(err){
	  console.log("there is an error");
	}
	else{
	 if(res.length === 0){
           console.log("there is no course with the given ID");
	 }
	 else if(res.length > 1){
	   console.log("there are more than 1 course with the given ID, this is a database error");
	 }
	 else{
	   var lab = res[0].labs.find(function(lab){ return lab.lab_id === labId; });
	   if(!slf.check(lab)){
 	     console.log("labFile is corrupt");
	   }
	   else{
	     this.tuxlab = eval(lab.labFile);
	     if(!lab.tasks){
	       lab.tasks = slf.parseTasks();
	     }
	   }
	 }
      }});
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
