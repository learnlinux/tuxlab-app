var _eval = require('eval');
var fs = require('fs');
var file = "";
var labExec = function(){
  this.env = require('./env.js');
};
//var env = require('./env.js');
//commented out part for testing purposes only
/*fs.readFile('./tuxlabTest.txt','utf8',function(err, data){
  if(err) { console.log(err); }
  else { file = data; }
  rest()
})
function rest(){
  var tux;
  new Promise(function(res,rej){
    tux = eval(file);
    res();}).then(function(){console.log(typeof tux.setup);})
}*/
labExec.prototype.init = function(labFile){
  this.tuxlab = eval(labFile);
  if(!(typeof this.tuxlab.setup == 'function' && 
       typeof this.tuxlab.tasks == 'function')){
    throw "labFile has errors"
}}
labExec.prototype.parseTasks = function(){
  return this.tuxlab.taskList.map(function(task){ return {title: task.title,
							  markdown: task.markdown,
							  }; });
}
labExec.prototype.start = function(callback){
  var slf = this;
  var env = null;
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
