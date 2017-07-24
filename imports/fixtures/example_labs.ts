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
    env.next();
  });

  /* @Task 1
     Description of task.  Task is pretty cool.
  */
  Lab.nextTask({
    setup: function(env){
      env.next();
    },
    verify: function(env){
      env.next();
    }
  });

  /* @Task 2
     Description of task.  Task is pretty cool.
  */
  Lab.nextTask({
    setup: function(env){
      env.next();
    },
    verify: function(env){
      env.fail();
    }
  })

  // Destroy function for performing any final tasks
  Lab.destroy(function(env){
    env.next();
  });
`;
