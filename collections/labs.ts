import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

import { Roles } from './users.ts';

export const labs : any = new Mongo.Collection('labs');

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
        updated: {
          type: Number,
          autoValue: function(){
            return Date.now();
          }
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

/* LAB VALIDATOR */
  if(Meteor.isServer){
    Meteor.startup(function(){
      var LabValidator = function(userid, doc, fieldNames?, modifier?, options?){
        if (typeof fieldNames === "undefined" || fieldNames.includes('tasks') || fieldNames.includes('file')){
          //TODO @CEM: Validate Lab
          //TODO @CEM: Generate tasks array
        }
      }
      labs.before.update(LabValidator);
      labs.before.insert(LabValidator);
    });
  }
