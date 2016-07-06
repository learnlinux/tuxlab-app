import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

import { Roles } from './user.ts';

export let courses = new Mongo.Collection('courses');

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
