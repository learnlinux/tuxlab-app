import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
 
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
        return 
               ((typeof user.roles.administrator !== 'undefined') &&
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
