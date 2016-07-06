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


/* Schema */
declare var SimpleSchema: any;

if (Meteor.isServer){
  Meteor.publish('courses', function() {
	return courses.find();
  });
  Meteor.startup(function(){
    var taskSchema = new SimpleSchema({
      _id: {
        type: String
      },
      name: {
        type: String
      },
      md: {
        type: String
      }
    });
    var labSchema = new SimpleSchema({
      _id: {
        type: String
      },
      lab_name: {
        type: String
      },
      file: {
        type: String
      },
      tasks: {
        type: [taskSchema]
      }
    });
    var courseSchema = new SimpleSchema({
      course_name: {
        type: String
      },
      course_number: {
        type: String
      },
      labs: {
        type: [labSchema]
      }
    });
    (<any>courses).attachSchema(courseSchema);
  });
}
