var tuxlab = new lab();

tuxlab.tasks = function(){
  var s1 = function(env){
    return env.start();
  }
  var v1 = function(env){
    return env.start();
  }
  var s2 = function(env){
    return env.start();
  }
  var v2 = function(env){
    return env.start();
  }
  var s3 = function(env){
    return env.start();
  }
  var v3 = function(env){
    return env.start();
  }
  var s4 = function(env){
    return env.start();
  }
  var v4 = function(env){
    return env.start();
  }
  /* @task1 this is task 1 
   tomato{}  
   hi();
    @onevar1
   I'm a cheesepuff
   @othervar1
  */
  var task1 = tuxlab.newTask('TASK1','MD1',s1,v1)
  /*
@task2
this is task 2 
   potato{}  
   bye();
    @onevar2
   I'm a cheesepuff
   @anothervar2
  */
  var task2 = tuxlab.newTask('TASK2','MD2',s2,v2)
  /*@task3 this is task 3
   onion{}  
   later();
    @onevar3
   I'm a cheesepuff
   @othervar3
  */
  var task3 = tuxlab.newTask('TASK3','MD3',s3,v3)
  /*
   @task4 this is task 4
   turnip{}  
   ello();
    @onevar4
   I'm a cheesepuff
   @othervar4
  */
  var task4 = tuxlab.newTask('TASK4','MD4',s4,v4)
  return tuxlab.init()
           .nextTask(task1)
           .nextTask(task2)
           .nextTask(task3)
           .nextTask(task4);
}
//export modified tuxlab
module.exports = tuxlab;
