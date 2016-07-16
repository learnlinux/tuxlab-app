import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { Roles } from './users.ts';

declare var _ : any;
var _ = require('underscore');

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
  declare var _: any;
  var _ = require('underscore');

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
          regEx: SimpleSchema.RegEx.Id,
          custom: function() {
            // Check existance of course
            let currentCourse = Collections.courses.findOne({ _id: this.value });
            if(currentCourse === "undefined") {
              labSchema.addInvalidKeys([{name: "course_id", type: "nonexistantCourse"}]);
            }
            // Check whether user is authorized
            let instructors = currentCourse.instructor_ids;
            if(Collections.courses.findOne({ _id: this.value, instructor_ids: this.userId }) === "undefined") {
              labSchema.addInvalidKeys([{name: "course_id", type: "unauthorizedUser"}]);
            }
          }
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
    declare var validateLab : any;
    var validateLab : any = require('../server/imports/lab/checkLab.js');

    Meteor.startup(function(){
      var LabValidator = function(userid, doc, fieldNames?, modifier?, options?){
        if (typeof fieldNames === "undefined"){
          if(!(doc.course_id && doc.file && //check for lab fields

             Roles.isInstructorFor(doc.course_id,userid))){//check for instructor authorization
	    return false;
	  }
	  else{
	    var titleList = validateLab(doc.file);
	    if(!titleList){
              return false; }
	    else{
              return titleList;
	    }
	  }

        }
      	else if(fieldNames.includes('tasks') && !fieldNames.includes('file')){
                return false;
      	}
      	else if(fieldNames.includes('file')){
      	  if(!((Roles.isInstructorFor(doc.course_id,userid)) && //check for instructor authorization
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
      Meteor.publish('user-labs',function(){
        this.autorun(function(computation){
          let roles = (<any>(Meteor.users.findOne(this.userId))).roles;
          let courses = roles.student.map((a) =>{return a[0]});
          return (courses.map(function(courseId){return {course: courseId, labs: ((Collections.courses.findOne(courseId)).labs)}}));
	});
      });
    });
  }

/**
  DATA PUBLICATION
**/
if(Meteor.isServer) {
  Meteor.startup(function() {
    // Publish labs collection
    Meteor.publish('labs', function() {
      this.autorun(function(computation) {

        // Check if userId exists
        if(typeof this.userId !== "undefined") {

          // Check if userId is indeed in the database
          let user = Meteor.users.findOne(this.userId);
          if(typeof user !== "undefined") {

            // Define roles of current user
            let roles = (<any>(user)).roles;
            if(typeof roles !== "undefined") {

              // Get student enrolled courseIds
              let studentCourses = (_.unzip(roles.student))[0];

              // Concatenate student enrolled courseIds with Instructor taught courseIds
              let course_ids = studentCourses.concat(roles.instructor);

              // Search Query
              return labs.find({
                course_id: {
                  $in: course_ids
                }
              });
            }
          }
        }
      });
    });
  });
}
