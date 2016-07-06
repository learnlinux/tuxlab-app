declare var Collections : any;
Meteor.methods({
  'test'(){
    return "hello";
  },
  'createLab': function(courseId : String,labId : Number){
    var course = Collections.courses.findOne({_id: courseId}).fetch();
    //var t = require('../api/labExec.js');
    return course.labs.find((l) => { return l._id == labId; });
  }
});

