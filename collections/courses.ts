import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

import { Roles } from './users.ts';

export const courses = new Mongo.Collection('courses');

const MAX_COURSES = 4;

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

/* SCHEMA */
  declare var SimpleSchema: any;

  if (Meteor.isServer){
		Meteor.publish('courses', function() {
			console.log(this.userId);
			const options = {
				sort: { course_number: 1 },
				limit: MAX_COURSES
			};
			return courses.find({}, options);
		});
    Meteor.startup(function(){
      var courseSchema = new SimpleSchema({
        course_name: {
          type: String
        },
        course_number: {
          type: String
        },
        labs: {
          type: [String],
          regEx: SimpleSchema.RegEx.Id
        }
      });
      (<any>courses).attachSchema(courseSchema);
    });
  }
