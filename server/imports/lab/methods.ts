declare var Collections : any;
Meteor.methods({
  'prepareLab': function(courseId : String,labId : Number){
     console.log("here");
	  //  var course = Collections.courses.findOne({_id: courseId}).fetch();
    //var t = require('../api/labExec.js');
   // return course.labs.find((l) => { return l._id == labId; });
  }
});

