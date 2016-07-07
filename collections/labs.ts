import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

import { Roles } from './users.ts';

export const labs = new Mongo.Collection('labs');

/**
  AUTHENTICATION
**/
labs.allow({
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
    Meteor.startup(function(){
      var taskSchema = new SimpleSchema({
        _id: {
          type: String
        },
        name: {
          type: String
        },
        md: {
          type: String
        }
      });
      var labSchema = new SimpleSchema({
        _id: {
          type: String
        },
        course_id: {
          type: String,
          regEx: SimpleSchema.RegEx.Id
        },
        lab_name: {
          type: String
        },
        file: {
          type: String
        },
        tasks: {
          type: [taskSchema]
        }
      });
      (<any>labs).attachSchema(labSchema);
    });
  }
