import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export let course_records = new Mongo.Collection('course_records');

var myCourseRecord = {
  user_id: '1',
  course_id: 'wJ492j3YqcCH7saAx',
  labs: [
    {
      _id: '1',
      data: {
        test_data: 'test-data',
        due_date: 'Sept. 7th'
      },
      tasks: [
        {
          _id: '1',
          status: 'SUCCESS',
          grade: {
            earned: 88, 
            total: 100
          },
          data: {
            // Additional Data
          }
        },
        {
          _id: '2',
          status: 'SUCCESS',
          grade: {
            earned: 95, 
            total: 100
          },
          data: {
            // Additional Data
          }
        },
        {
          _id: '3',
          status: 'SUCCESS',
          grade: {
            earned: 85, 
            total: 100
          },
          data: {
            //Additional Data
          }
        }
      ]
    },
    {
      _id: '2',
      data: {
        test_data: 'test-data',
        due_date: 'Sept. 14th'
      },
      tasks: [
        {
          _id: '1',
          status: 'SUCCESS',
          grade: {
            earned: 78,
            total: 100
          },
          data: {
            //Additional Data
          }
        },
        {
          _id: '2',
          status: 'SUCCESS',
          grade: {
            earned: 89,
            total: 100
          },
          data: {
            //Additional Data
          }
        }
      ]
    }
  ]
};

if(Meteor.isServer) {
  if(course_records.find().count() === 0) {
    course_records.insert(myCourseRecord); 
  }
  Meteor.publish('course-records', function() {
    return course_records.find();
  });
}





/*
export let Course_records = new Mongo.Collection('course_records');
 
Course_records.allow({
  insert: function (userId, doc) {
    let user = Meteor.user().profile
    if (typeof user !== 'undefined') {
      if (typeof user.roles !== 'undefined') {  
        if (typeof user.roles.administrator !== 'undefined') {
          return (user.roles.administrator.indexOf('global') >= 0) ||
                 (typeof doc.course_id !== 'undefined' &&
                  user.roles.administearor.indexOf(doc.course_id) >= 0);
        }
      }
    }
    return false;
  },
  update: function (userId, doc, fields, modifier) {
    let user = Meteor.user().profile
    if (typeof user !== 'undefined') {
      if (typeof user.roles !== 'undefined') {  
        return ((typeof user.roles.administrator !== 'undefined') &&
                 ((user.roles.administrator.indexOf('global') >= 0) ||
                  (typeof doc.course_id !== 'undefined' &&
                   user.roles.administrator.indexOf(doc.course_id) >= 0))) ||
               (((typeof user.roles.instructor !== 'undefined') &&
                 ((user.roles.instructor.indexOf('global') >= 0) ||
                  (typeof doc.course_id !== 'undefined' &&
                   user.roles.instructor.indexOf(doc.course_id) >= 0))) &&
                (fields.indexOf('_id') < 0 &&
                 fields.indexOf('user_id') < 0 &&
                 fields.indexOf('course_id') < 0));
                //TODO: CHECK LOWER LEVEL CHANGES
      }
    }
    return false
  },
  remove: function(userId, doc) {
    let user = Meteor.user().profile
    if (typeof user !== 'undefined') {
      if (typeof user.roles !== 'undefined') {  
        if (typeof user.roles.administrator !== 'undefined') {
          return (user.roles.administrator.indexOf('global') >= 0) ||
                 (typeof doc.course_id !== 'undefined' &&
                  user.roles.administearor.indexOf(doc.course_id) >= 0);
        }
      }
    }
    return false;
  }
});
*/