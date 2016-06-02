/** TuxLab API

// Require Docker VM Components
tuxvm = require('./tuxlab.vm.js');
var tuxlab;

/* create a new Task (promise) 
 * with a setup function and a verification function
 */
tuxlab.newTask = function(setupFn,verifer){
tuxlab.newTask = function(){

    /* get user input from frontend */
	var input;
   
   /* return a task which resolves when verified to be correct, 
    * and reject when wrong 
    */
	var task = new Promise(function (resolve,reject){
		setupFn()
		
		if verifer(input){resolve()}
		else{reject()}

	});

	return task;

}

tuxlab.init = function(setupFn,verifier){

	return newTask(setupFn,verifier)
}

/* If the current task verified to be correct, 
 * move on the next one, otherwise load the same task
 */
tuxlab.nextTask = function(nextTask){

	var currentTask;

	currentTask.then(return Tuxlab.next(nextTask))

	.catch(return currentTask)


}

// Export Module

module.exports = tuxlab


  
module.exports = tuxlab

**/
