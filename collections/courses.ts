import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

import { Roles } from './users.ts';

export let courses = new Mongo.Collection('courses');

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

if (Meteor.isServer){
  Meteor.startup(function(){
    var courseSchema = new SimpleSchema({
      //TODO @sander
    });
    (<any>courses).attachSchema(courseSchema);
  });
}

/**
  LABS
**/
