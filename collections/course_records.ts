import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

import { Roles } from './users.ts';

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

/* Schema */
declare var SimpleSchema: any;


if(Meteor.isServer) {
	Meteor.publish('course-records', function() {
		const user = Meteor.users.findOne(this.userId);
		if(user) {
			return course_records.find({
				user_id: this.userId
			}, {
				fields: {
					'labs.data': 0,
					'labs.tasks.data': 0
				}
			});
		}
		else {
			return null;
		}
	});
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
        regEx: SimpleSchema.RegEx.Id
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
        type: String
      },
      course_id: {
        type: String
      },
      labs: {
        type: [labSchema]
      }
    });
    (<any>course_records).attachSchema(recordSchema);
  });
}
