import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

import {Roles} from './user.ts';

export let Courses = new Mongo.Collection('courses');

/*
Courses.allow({
  insert: function (userId, doc) {
    let user = Meteor.user().profile
    if (typeof user !== 'undefined') {
      if (typeof user.roles !== 'undefined') {
        if (typeof user.roles.administrator !== 'undefined') {
          return user.roles.administrator.indexOf('global') >= 0;
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
                  (typeof doc._id !== 'undefined' &&
                   user.roles.administrator.indexOf(doc._id) >= 0))) ||
               ((typeof user.roles.instructor !== 'undefined') &&
                ((user.roles.instructor.indexOf('global') >= 0) ||
                 (typeof doc._id !== 'undefined' &&
                  user.roles.instructor.indexOf(doc._id) >= 0)));
      }
    }
    return false;
  },
  remove: function(userId, doc : any) {
    let user = Meteor.user().profile
    if (typeof user !== 'undefined') {
      if (typeof user.roles !== 'undefined') {
        if (typeof user.roles.administrator !== 'undefined') {
          return (user.roles.administrator.indexOf('global') >= 0 ||
                  (typeof doc._id !== 'undefined' &&
                   user.roles.administrator.indexOf(doc._id) >= 0));
        }
      }
    }
    return false;
  }
});
*/
