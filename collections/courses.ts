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
      Meteor.publish('user-courses', function() {
        this.autorun(function(computation){
          // Get Course IDs
					if (typeof this.userId !== "undefined") {
						let roles = (<any>(Meteor.users.findOne(this.userId))).
					}
          let roles = (<any>(Meteor.users.findOne(this.userId))).roles;
          let course_ids = ((_.unzip(roles.student))[0]).concat(roles.instructor);
					
          // Publish Matching Course IDs
          return courses.find({_id: {$in : course_ids}});
        });
      });

			// Publish All Courses
      Meteor.publish('all-courses', function(){
				this.autorun(function(computation) {
					return courses.find();
				});
      });
      //TODO @sander Publish Course Based on Route
    });
  }
