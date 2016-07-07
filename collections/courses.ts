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

/* SCHEMA */
  declare var SimpleSchema: any;

  if (Meteor.isServer){
		Meteor.publish('courses', function() {
			if(this.userId) {
				let courseRecords = course_records.find({ _id: this.userId });
				let courseIds = courseRecords.map(function(cr) {
					return (<any>cr).course_id;
				});
				const query = {
					'_id': {
						$in: courseIds
					}
				};
				return courses.find(query);
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
