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
    return Roles.isGlobalAdministrator(userId);
  },
  update: function (userId, doc : any, fields : any) {
    if(fields.indexOf('featured') >= 0){
      return Roles.isAdministratorFor(userId);
    }
    else{
      return Roles.isAdministratorFor(doc._id, userId) || Roles.isInstructorFor(doc._id, userId);
    }
  },
  remove: function(userId, doc : any) {
    return Roles.isGlobalAdministrator(userId);
  }
});

/**
  SCHEMA
**/
  declare var SimpleSchema: any;
	declare var _: any;
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

      var permissionsSchema = new SimpleSchema({
        meta: {
          type: Boolean,
          defaultValue: true
        },
        content: {
          type: String,
          allowedValues: ['any', 'auth', 'none'],
          defaultValue: 'auth'
        },
        enroll: {
          type: String,
          allowedValues: ['any', 'none'],
          defaultValue: 'none'
        }
      });

      var instructorSchema = new SimpleSchema({
        name: {
          type: String
        },
        id: {
          type: String
        }
      });
      var courseSchema = new SimpleSchema({
        _id: {
           type: String,

        },
        course_name: {
          type: String
        },
        course_number: {
          type: String
        },
        instructors: {
          type: [instructorSchema],
          custom: function() {
            let instructorIds = this.value.map(function(tuple) {
              return tuple.id;
            });
            let validInstructors = Meteor.users.find({ _id: { $in: instructorIds } });

            // Check that all instructors exist
            if(validInstructors.count() !== this.value.length) {
              return("One or more instructors are invalid.");
            }
            else{
              return(null);
            }
          }
        },
        course_description: {
          type: descriptionSchema,
          optional: true
        },
        featured:{
          type: Boolean,
          defaultValue: false
        },
        permissions:{
          type: permissionsSchema,
        },
        labs: {
          type: [String],
          custom: function() {
            let validLabs = labs.find({ _id: { $in: this.value } });
            // Check that all labs are valid
            if(validLabs.count() !== this.value.length) {
              return("One or more labs were invalid.");
            }
            else{
              return(null);
            }
          }
        }
      });
      (<any>courses).attachSchema(courseSchema);
    });
  }

/***
  INTERFACE
**/

  /** Enrollable **/
  export class Enroll{

    static isEnrollable(course_id : string, user_id? : string){
      var course : any = courses.findOne(course_id);

      if (typeof course === "undefined" || course === null){ // Course not Found
        return false;
      } else if(course.permissions.enroll === "none"){ // Course disabled
        return false;
      } else if (course.permissions.enroll === "any"){ // Course is enrollable
        return true;
      } else {
        return false;
      }

    }

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

              // Get course ids of courses that the student is enrolled in
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
      Meteor.publish('explore-courses', function(){
        this.autorun(function(computation) {
          if (Roles.isGlobalAdministrator(this.userId)) {
            return courses.find();
          }
          else {
            return courses.find({
              "permissions.meta": true,
              "featured": true
            });
          }
        });
      });

      //TODO @sander Publish Course Based on Route
    });
  }
