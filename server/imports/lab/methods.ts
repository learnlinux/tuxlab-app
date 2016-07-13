import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

declare var Collections : any;

Meteor.methods({
  'prepareLab': function(courseId : String,labId : Number){
     console.log("here");
	  //  var course = Collections.courses.findOne({_id: courseId}).fetch();
    //var t = require('../api/labExec.js');
   // return course.labs.find((l) => { return l._id == labId; });
  },
  'search_courses': function(text : String){
     var courses = Collections.courses;

     var search_pattern = new RegExp(text,"i");

     var number_search = {"course_number" : search_pattern};
     var alternate_number_search = {$where: "this.course_number.replace(/[ .-]/g,'') == '"+text+"'"};
     var name_results = {"course_name" : search_pattern};

     var results = courses.find({$and : [{"visible" : true}, {$or : [number_search, alternate_number_search, name_results]}}).limit(15);

     return results;
   }
});

