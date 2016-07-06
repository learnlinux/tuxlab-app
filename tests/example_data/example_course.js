/**
  Example Data for the 15-131
**/

// Import LabFile
var course_labfile = require('fs').readFileSync('./tests/example_data/example_labfile.js', "utf8").toString();

var course_obj = {
  course_number: "15-131",
  course_name: "Great Practical Ideas for Computer Scientists",
  instructor_name: "Tom Cortina",
  file: course_labfile,
  labs: [
    {
      _id: 1,
      lab_name: "Getting Started with Git",
      file: course_labfile,
      tasks: [
        {
          _id: 1,
          name: "Git Clone",
          md: "Git Clone Testing!"
        }
      ]
    }
  ]
}

module.exports = course_obj;
