import { Component } from '@angular/core'
import { Meteor } from 'meteor/meteor';

/***
  SCHEMA
***/
declare var SimpleSchema: any;
declare var nconf: any;

if (Meteor.isServer){
  Meteor.startup(function(){

    // Defines User Profile
    var profileSchema = new SimpleSchema({
      first_name: {
        type: String
      },
      last_name: {
        type: String
      },
      nickname: {
        type: String,
        unique: true,
        regEx: /^[a-zA-Z0-9_-]*$/
      },
      school: {
        type: String,
        defaultValue: nconf.get('domain_school')
      },
      email: {
        type: String
      },
      picture: {
        type: String
      }
    });

    // Defines User Abilities
    var roleSchema = new SimpleSchema({
      administrator: {
        type: [String],
        defaultValue: []
      },
      instructor: {
        type: [String],
        defaultValue: []
      },
      student: {
        type: [{
          type: [String],
          maxCount: 2,
          minCount: 2
        }],
        defaultValue: []
      }
    });

    // Defines Notifications presented to user
    var announcementSchema = new SimpleSchema({
      timeCreated: {
        type:  Date,
        autoValue: function(){
          return Date.now();
        }
      },
      type: {
        type: String,
        allowedValues: ['lab','instructor','tuxlab']
      },
      message: {
        type: String
      },
      link: {
        type: String,
        optional: true
      }
    })
    
    var sessionSchema = new SimpleSchema({
      labId:{
        type: String
      },
      started:{
        type: Number,
	autoValue: function(){
	  return Date.now();
	}
      }
    });

    // Overall User Schema
    var userSchema = new SimpleSchema({
      services: {
        type: Object,
        optional: true,
        blackbox: true
      },
      profile: {
        type: profileSchema
      },
      roles: {
        type: roleSchema
      },
      announcements:{
        type: [announcementSchema],
        defaultValue: []
      },
      sessions:{
        type: [sessionSchema],
	defaultValue: []
      }
    });
    (<any> Meteor.users).attachSchema(userSchema);
  });
}

/***
  INTERFACE
**/

  /***
    USER ROLES
  ***/
  export class Roles {
    /*
      Determines if user is logged in
    */
    static isLoggedIn(user){
      return (typeof user !== 'undefined' && user !== null && <any> user.roles !== 'undefined');
    }

    /*
      Determines if the user is a student in a particular course
    */
    static isStudentFor(courseid : string, userid? : string){
      let user : any = (typeof userid !== "undefined") ? Meteor.users.findOne(userid) : Meteor.user();

      if(this.isLoggedIn(user) && Array.isArray(user.roles.student)){
        for (var i = 0; i < user.roles.student.length; i++){
          if (user.roles.student[i][0] === courseid) {
            return true;
          }
        }
        return false;
      }
      else{
        return false;
      }
    }

    /*
      Determines if the user is an instructor for a particular course
    */
    static isInstructorFor(courseid : string, userid? : string){
      let user : any = (typeof userid !== "undefined") ? Meteor.users.findOne(userid) : Meteor.user();
      return (this.isLoggedIn(user) && (typeof user.roles !== "undefined") && Array.isArray(user.roles.instructor) && (user.roles.instructor.indexOf(courseid) >= 0));
    }

    /*
      Determines if the user is an administrator for a course
    */
    static isAdministratorFor(courseid : string, userid? : string){
      let user : any = (typeof userid !== "undefined") ? Meteor.users.findOne(userid) : Meteor.user();
      return (this.isLoggedIn(user) && (typeof user.roles !== "undefined") && Array.isArray(user.roles.administrator) && ((user.roles.administrator.indexOf('global') >= 0) || (user.roles.administrator.indexOf(courseid) >= 0)));
    }

    /*
      Determines if the user is a global administrator
    */
    static isGlobalAdministrator(userid? : string){
      let user : any = (typeof userid !== "undefined") ? Meteor.users.findOne(userid) : Meteor.user();
      return (this.isLoggedIn(user) && (typeof user.roles !== "undefined") && Array.isArray(user.roles.administrator) && (user.roles.administrator.indexOf('global') >= 0));
    }
  };

 /***
    USER PROFILE PUBLICATION
 **/
 Meteor.methods({
   'getUserProfile': function(uid : string){
     if(Roles.isGlobalAdministrator(this.userId)){
        return Meteor.users.findOne(uid).profile;
     }
     else{
        throw new Meteor.Error("Auth", "Must be admin to access user profile.");
     }
   }
 });

if(Meteor.isServer) {
  Meteor.startup(function() {
    Meteor.publish('userRoles', function() {
      this.autorun(function(computation) {
        return Meteor.users.find(this.userId, { fields: { "roles": 1, "sessions": 1} });
      });
    });
  });
}
if(Meteor.isClient) {
    Meteor.subscribe('userRoles');
}
