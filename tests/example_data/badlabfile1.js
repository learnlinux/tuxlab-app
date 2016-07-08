var tuxlab = require('./tuxlab.js');

tuxlab.setup = 5;
tuxlab.tasks = function(env){
  var s1 = function(){
    env.start()
      .then(env.createVm({dockerodeCreateOptions: {name: "derek"}}))
      .then(env.shell("labVm","cd ~./home/usr/derek"))
      .then(function(sOut){ console.log("succ: "+sOut); },
        function(sOut,sErr,sDock){ throw sOut+sErr+sDock; });
  }
  var v1 = function(){
    env.shell("labVm","pwd")
      .then(function(sOut){ if(sOut === "/usr/home/derek") return true; else return false; });
  }
  var s2 = function(){}
  var v2 = function(){}
  var s3 = function(){}
  var v3 = function(){}
  var s4 = function(){}
  var v4 = function(){}
  var task1 = tuxlab.newTask('TASK1','MD1',s1,v1)
  var task2 = tuxlab.newTask('TASK2','MD2',s2,v2)
  var task3 = tuxlab.newTask('TASK3','MD3',s3,v3)
  var task4 = tuxlab.newTask('TASK4','MD4',s4,v4)
  return tuxlab.init()
           .nextTask(task1)
           .nextTask(task2)
           .nextTask(task3)
           .nextTask(task4);
}
module.exports = tuxlab;
//export tuxlab
