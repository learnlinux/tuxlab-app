import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

import { Roles } from './users.ts';

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

if (Meteor.isServer){
  Meteor.startup(function(){
    var courseSchema = new SimpleSchema({
      course_name: {
        type: String
      },
      course_number: {
        type: String
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

if (Meteor.isServer){
  Meteor.startup(function(){

    // Publish Courses the User is Enrolled In
    Meteor.publish('courses', function(){
      this.autorun(function(){
        if(this.userId !== null){
          var user = Meteor.users.findOne(this.userId, {fields: {roles: 1}});

          return courses.find({})
        }
        else{
          return [];
        }
      });
    });


  });
}
