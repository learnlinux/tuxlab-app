import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

import { Roles } from './users.ts';

// Course Records Import
import { course_records } from './course_records.ts';

export const courses = new Mongo.Collection('courses');



/**
  AUTHENTICATION
**/
courses.allow({
  insert: function (userId, doc : any) {
    return Roles.isGlobalAdministrator();
  },
  update: function (userId, doc : any, fields : any) {
    return Roles.isAdministratorFor(doc._id) || Roles.isInstructorFor(doc._id);
  },
  remove: function(userId, doc : any) {
    return Roles.isGlobalAdministrator();
  }
});

/**
  SCHEMA
**/
  declare var SimpleSchema: any;
	declare var _: any;
  var _ = require('underscore');
  if (Meteor.isServer){
    Meteor.startup(function(){
      var descriptionSchema = new SimpleSchema({
        content: {
          type: String,
          defaultValue: ""
        },
        syllabus: {
          type: String, 
          defaultValue: ""
        }
      });
      var courseSchema = new SimpleSchema({
        course_name: {
          type: String
        },
        course_number: {
          type: String
        },
        instructor_name: {
          type: String
        },
        course_description: {
          type: descriptionSchema	
        },
        labs: {
          type: [String]
        }
      });
      (<any>courses).attachSchema(courseSchema);
    });
  }

/**
  DATA PUBLICATION
**/
  if(Meteor.isServer){
    Meteor.startup(function(){

  // Publish My Courses
  Meteor.publish('user-courses', function() {
    this.autorun(function(computation){

      // Check existance of userId
      if (typeof this.userId !== "undefined") {

        // Check if userId indeed corresponds to a user in the database
        let user = Meteor.users.findOne(this.userId);
        if (typeof user !== "undefined") {
          let studentCourseIds = (_.unzip((<any>user).roles.student))[0];
          let course_ids = studentCourseIds.concat((<any>user).roles.instructor);
          // Publish courses that match
          return courses.find({ _id: { $in: course_ids } });
        }
      }
    });
  });

  // Publish All Courses
  Meteor.publish('all-courses', function(){
    this.autorun(function(computation) {
      if(typeof this.userId !== "undefined") {
        let user = (Meteor.users.findOne(this.userId));
        if(typeof user !== "undefined") {
          return courses.find();
        }
      }
    });
  });

      //TODO @sander Publish Course Based on Route
    });
  }



