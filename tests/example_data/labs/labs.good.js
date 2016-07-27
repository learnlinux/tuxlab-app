/**
  Example Labs
**/

// Import Labfiles
var fs = require('fs');
var labfile = [];
labfile[0] = fs.readFileSync(__dirname+'/lab.good.1.js', "utf8").toString();

// Export Labs
module.exports = [
  {
    _id: "1",
    course_id : "1",
    lab_name: "Getting Started with Git",
    updated: 1467995862937,
    hidden: false,
    disabled: false,
    file: labfile[0],
    tasks: [
      {
        _id: "1",
	name: "Git Clone",
        updated: 1467995862937,
        md: "##################"
      },
      {
        _id: "2",
	name: "Git Pull",
        updated: 1467995862937,
        md: "##################"
      }
    ]
  },
  {
    _id: "2",
    course_id: "1",
    lab_name: "More with Git",
    updated: 4,
    hidden: false,
    disabled: false,
    file: "##########",
    tasks: [
      {
        _id: "1",
	name: "Git add",
	updated:4,
	md: "#############"
      },
      {
        _id: "2",
	name: "Git commit",
	updated:4,
	md: "##########"
      },
      {
        _id: "3",
	name: "Git push",
	updated: 4,
	md: "#########"
      }
    ]
  },
  {
    _id: "3",
    course_id: "2",
    lab_name: "Introduction to Python",
    updated: 5,
    hidden: false,
    disabled: true,
    file: "##########",
    tasks: [
      {
        _id: "1",
	name: "Functions",
	updated: 5,
	md: "##########"
      },
      {
        _id: "2",
	name: "Values",
	updated:4,
	md: "#"
      }
    ]
  }
]
