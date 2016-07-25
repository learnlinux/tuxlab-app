/**
  Example Labs
**/

// Import Labfiles
var labfile = [];
    labfile[0] = require('fs').readFileSync('./lab.good.1.js', "utf8").toString();

// Export Labs
module.exports = [
  {
    course_id : course_id,
    lab_name: "Getting Started with Git",
    file: labfile[0],
    tasks: [
      {
        _id: 1,
        updated: 1467995862937,
        name: "Git Clone",
        md: "##################"
      },
      {
        _id: 2,
        updated: 1467995862937,
        name: "Git Pull",
        md: "##################"
      }
    ]
  }
]
