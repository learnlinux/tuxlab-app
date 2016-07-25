var tuxlab = new lab();

tuxlab.setup_git_clone = function(env){
  return env.init()
}
tuxlab.tasks = function(){
  var s1 = function(env){
    return env.start()
	     .then(env.shell("labVm", "cd /"));
             .then(env.shell("labVm", "mkdir git_lab1"));
  }
  var verify_git_clone = function(env,record){
    return env.start()
      .then(env.shell("labVm","cd /git_lab1")); //go to root
      .then(env.shell("labVm","pwd"),  //run pwd
	    function(){		    //error case of cd
              record.setGrade([0,3]); //set grade to 0/3
	      record.feedBack("You got 0/3 \n the folder \"/git_lab1\" seems to have been deleted");  //give feedback
              return Promise.reject(); //reject the promise
            }))

      .then(function(sOut,sErr){  //check result of pwd
              if(sErr){  //if pwd gives an error
	        record.setGrade([0,3]);  //set grade to 0/3
		return Promise.reject();  //reject the promise
              }
	      else if(sOut.includes("myLab"))  //if pwd shows folder "myLab"
                record.setGrade([1,3]);  //set grade to 1/3
	        return Promise.resolve();  //resolve the promise
              }
	      else{
	        record.setGrade([0,3]);
		record.feedBack("you got 0/3 \n there appears to be no folder \"myLab\", perhaps you git cloned with another name?"); //give feedback
		return Promise.reject();
	      }
      },function(){ //error case of pwd
        record.setGrade([0,3]);  //set grade to 0/3
        return Promise.reject();  //reject the promise
      })
      .then(env.shell("labVm","cd /git_lab1/myLab")) // go to git dir

      .then(env.shell("labVm","git pull"),  //try git pulling     
       function(){
         return Promise.reject(); //in reject case grade already set
       })

       .then(function(sOut,sErr){
         if(sErr){  //if git clone has errors
	   record.feedback("git seems to be unable to clone");  //give feedback
	 }
	 else if(sOut.includes("up to date")){  //check whether git repo is cloned and unchanged
	   record.setGrade([3,3]);  //set grade to 3/3
	   record.feedBack("congratz!");  //give feedback
	   return Promise.resolve();  //resolve promise
	 }
	 s1(env).then(() => {return Promise.reject()}) //setup the task again if it fails, reject
       },
       function(){
         return Promise.reject(); //reject the promise
       });

  }
  var setup_task2 = function(env){
    return env.start();
  }
  var v2 = function(env,record){
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
  /* @TASK1
    # Task1: Git Clone 
    ## Clone the github repository
    ``` https://github.com/cemersoz/tuxlab-app ```
    to a folder named \"myLab\" in /git_lab1
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
