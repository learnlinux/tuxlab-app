var fs = require('fs');
var tuxlab = function(){}

tuxlab.prototype.init = function(){
  var slf = this;
  var ts = {  prnt: slf,
              next: null,
              nextTask: function(tsk){
                this.next = tsk;
                this.prnt.taskList.push(tsk);
                return tsk;
              }
            }
  this.currentTask = ts;
  return ts;
}

tuxlab.prototype.currentTask = null;
tuxlab.prototype.taskList = [];
tuxlab.prototype.setup;
tuxlab.prototype.tasks;
tuxlab.prototype.newTask = function(ttl, mdown,sFn, vFn, opt){
  var slf = this;
  var ts = {  prnt: slf,
              setupFn: sFn,
              verifyFn: vFn,
	      opts: opt,
	      markdown: mdown,
	      title: ttl,
	      next: null,
	      completed: false,
	      nextTask: function(tsk){
	        this.next = tsk;
	        this.prnt.taskList.push(tsk);
	        return tsk;
	      },
	      isLast: function(){ return this.next === null; }
	    }
  return ts;
}
module.exports = new tuxlab();
