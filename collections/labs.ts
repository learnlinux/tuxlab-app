import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

import { Roles } from './users.ts';

declare var validateLab : any;
var validateLab = require('../server/imports/lab/checkLab');
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
  declare var Collections: any;
  declare var TuxLog: any;

	if(Meteor.isServer) {
		Meteor.publish('labs', function() {
			if(this.userId) {
				return labs.find({ hidden: false });
			}
			else {
				return null;
			}
		});
	}

  if (Meteor.isServer){
    Meteor.startup(function(){
      var taskSchema = new SimpleSchema({
        _id: {
          type: String
        },
        updated: {
          type: Number
        },
        name: {
          type: String
        },
        md: {
          type: String,
          defaultValue: ""
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
        hidden:{
          type: Boolean,
          defaultValue: true
        },
        disabled:{
          type: Boolean,
          defaultValue: false
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
        if (typeof fieldNames === "undefined"){
		console.log("inserting");
          if(!(doc.course_id && doc.file && //check for lab fields
             (Meteor.isServer || Roles.isInstructorFor(doc.course_id,userid))&& //check for instructor authorization
             validateLab(doc.file))){ //check for labfile errors
	    return false;
	  }
	  
          //TODO @CEM: Validate Lab
          //TODO @CEM: Generate tasks array
        }
	else if(fieldNames.includes('tasks') && !fieldNames.includes('file')){
          return false;
	}
	else if(fieldNames.includes('file')){
	  if(!((Meteor.isServer || Roles.isInstructorFor(doc.course_id,userid)) && //check for instructor authorization
		  validateLab(modifier.$set.file))){  //check for labfile errors
	    return false;
	  }
	  else{
	      if(modifier) {modifier.$set.updated = Date.now(); }
	      doc.updated = Date.now();
	  }
	}
      }
      labs.before.update(LabValidator);
      labs.before.insert(LabValidator);
    });
  }

/* INJECT LAB INTO COURSE */
  if(Meteor.isServer){
    Meteor.startup(function(){
      labs.after.insert(function(userid, doc){
        Collections.courses.update(doc.course_id,{ $push : { 'labs' : doc._id}}, function(err, num){
          if(err){
            TuxLog.log('warn', err);
          }
        });
      });
    });
  }
