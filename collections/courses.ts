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
  if(Meteor.isServer){
    Meteor.startup(function(){

       // Publish My Courses
       Meteor.publish('my-courses', function(){
          this.autorun(function(computation){

            // Get Course IDs
            var roles = Meteor.users.findOne(this.userId, {fields : {roles : 1}});
                course_ids = (_.unzip(roles.student)[0]).concat(roles.instructor);

            // Publish Matching Course IDs
            return courses.find({_id: {$in : course_ids}});

          });
       });

       //TODO @sander Publish Course Based on Route
    });
  }
