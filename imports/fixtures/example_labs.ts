/**
  Example Labfiles for Testing
**/

export const Example1 = `
/*
 *  Example Lab File
 *  author: Derek Brown
 */

  // Constructor for Lab.  No need to import anything!
  Lab = new TuxLab({
    name : "GitHub Lab",
    description: "Teaches users how to clone a repository.",
    vm: 'alpine'
  });

  // Setup function run before all other tasks
  Lab.init(function(env){
    env.success();
  });

  /* @Task 1
     Description of task.  Task is pretty cool.
  */
  Lab.nextTask({
    setup: function(env){
      env.success();
    },
    verifier: function(env){
      env.completed();
    }
  });

  /* @Task 2
     Description of task.  Task is pretty cool.
  */
  Lab.nextTask({
    setup: function(env){
      env.failure();
    },
    verifier: function(env){
      env.failed();
    }
  })

  // Destroy function for performing any final tasks
  Lab.destroy(function(env){
    env.success();
  });
`;
