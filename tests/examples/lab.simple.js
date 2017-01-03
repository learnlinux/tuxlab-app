/*
 *  Example Lab File
 *  @author: Derek Brown
 */

  // Constructor for Lab.  No need to import anything!
  Lab = new TuxLab({
    name : "GitHub Lab",
    description: "Teaches users how to clone a repository.",
    vm: 'alpine'
  });

  // Setup function run before all other tasks
  Lab.init(function(){

  });

  // Task
  /* @TASKNAME
     Description of task.  Task is pretty cool.
  */
  Lab.nextTask({
    setup: function(){

    },
    verifier: function(){

    }
  })
