import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

import { Roles } from './users.ts';

// Course Records Import
import { course_records } from './course_records.ts';

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
			const user = Meteor.users.findOne(this.userId);
			if(user) {
				let courseRecords = course_records.find({ _id: this.userId });
				let publishCourses = new Mongo.Collection(null);
				courseRecords.forEach(function(cr) {
					let courseId = cr.course_id;
					publishCourses.insert(courses.findOne({ _id: courseId }));
				});
				return courses.find({});
				// return publishCourses.find();
			}
			else {
				return null;
			}
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
          type: [String]
        }
      });
      (<any>courses).attachSchema(courseSchema);
    });
  }
