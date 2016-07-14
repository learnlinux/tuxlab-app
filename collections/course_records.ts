import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

import { Roles } from './users.ts';
import { courses } from './courses';
import { labs } from './labs';

export const course_records = new Mongo.Collection('course_records');

/**
  AUTHENTICATION
**/
course_records.allow({
  insert: function (userid, doc : any) {
    if (typeof doc.course_id !== "undefined"){
      return Roles.isInstructorFor(doc.course_id) || Roles.isAdministratorFor(doc.course_id);
    }
    else{
      return false;
    }
  },
  update: function (userid, doc : any, fields : any) {
    if( typeof doc.course_id !== "undefined" ){
      return Roles.isInstructorFor(doc.course_id) || Roles.isAdministratorFor(doc.course_id);
    }
    else{
      return false;
    }
  },
  remove: function(userid, doc : any) {
    return (typeof doc.course_id !== "undefined" && Roles.isAdministratorFor(doc.course_id));
  }
});

/**
  SCHEMA 
**/
declare var SimpleSchema: any;


if(Meteor.isServer) {
  Meteor.startup(function() {
    var taskSchema = new SimpleSchema({
      _id: {
        type: String
      },
      status: {
        type: String,
        allowedValues: ['SUCCESS', 'FAILURE', 'SKIPPED', 'IN_PROGRESS', 'NOT_ATTEMPTED']
      },
      grade: {
        type: [Number],
        minCount: 2,
        maxCount: 2
      },
      data: {
        type: Object,
        optional: true
      }
    });
    var labSchema = new SimpleSchema({
      _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        custom: function() {
          if(typeof labs.findOne({ _id: this.value }) === "undefined") {
            labSchema.addInvalidKeys([{name: "lab_id", type: "nonexistantLab"}]);
          }
        }
      },
      data: {
        type: Object,
        optional: true
      },
      tasks: {
        type: [taskSchema]
      }
    });
    var recordSchema = new SimpleSchema({
      user_id: {
        type: String,
        custom: function() {
          if(typeof Meteor.users.findOne({ _id: this.value }) === "undefined") {
            recordSchema.addInvalidKeys([{name: "user_id", type: "nonexistantUser"}]);
          }
        }
      },
      course_id: {
        type: String,
        custom: function() {
          let courseId = this.value;
          if (typeof courses.findOne({ _id: courseId }) === "undefined") {
            recordSchema.addInvalidKeys([{name: "course_id", type: "nonexistantCourse"}])
          }
        }
      },
      labs: {
        type: [labSchema]
      }
    });
    (<any>course_records).attachSchema(recordSchema);
  });
}

/**
  DATA PUBLICATION
**/
if(Meteor.isServer) {
  Meteor.startup(function() {

    // Publish course records
    Meteor.publish('course-records', function() {
      this.autorun(function(computation) {
        
        // Check existance of userId
        if(typeof this.userId !== "undefined") {

          // Check if userId indeed corresponds to a user in the database
          let user = Meteor.users.findOne(this.userId);
          if(typeof user !== "undefined") {

            // Get instructor taught courses
            let course_ids = (<any>user).roles.instructor;

            // Search Query
            return course_records.find({
              $or: [
                {
                  user_id: this.userId
                },
                {
                  course_id: {
                    $in: course_ids
                  }
                }
              ]
            }, {
              fields: {
                'labs.data': 0,
                'labs.tasks.data': 0
              }
            }); //return course_records 
          } // if (user != undefined)
        } // if (userId != undefined)
      }); // autorun
    }); // Meteor.publish
  }); //Meteor.startup
} //Meteor.isServer




