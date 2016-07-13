import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

import { Roles } from './users.ts';

// Course Records Import
import { course_records } from './course_records';
import { labs } from './labs';

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
        instructor_ids: {
          type: [String],
          custom: function() {
            let validInstructors = Meteor.users.find({ _id: { $in: this.value } }).count();
            // Check that all instructors exist
            if(validInstructors !== this.value.length) {
              return "One or more instructor ids do not exist";
            }
            // Check that the current user is an instructor of this course
            if(typeof Meteor.users.findOne({ _id: this.userId }) === "undefined") {
              return "Current user is not authorized.";
            }
          }
        },
        course_description: {
          type: descriptionSchema	
        },
        labs: {
          type: [String],
          custom: function() {
            let validLabs = labs.find({ _id: { $in: this.value } });
            // Check that all labs are valid
            if(validLabs.count() !== this.value.length) {
              return "One or more lab ids do not exist";
            }
          }
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
              
              // Get course ids of courses that the student is enroled in
              let studentCourseIds = (_.unzip((<any>user).roles.student))[0];
              if (typeof studentCourseIds !== "undefined") {
                
                // Concatenate with the courseIds that the instructor is teaching
                let course_ids = studentCourseIds.concat((<any>user).roles.instructor);
                
                // Publish matching courses
                return courses.find({ _id: { $in:course_ids } });
              }
            }
          }
        });
      });

      // Publish All Courses TODO: add pagination
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



