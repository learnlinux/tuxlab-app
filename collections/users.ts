import {Component} from '@angular/core'
import {Meteor} from 'meteor/meteor';

/***
  SCHEMA
***/
declare var SimpleSchema: any;

if (Meteor.isServer){
  Meteor.startup(function(){
    var userSchema = new SimpleSchema({
      //TODO @sander
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
  static isLoggedIn(){
    let user : any = Meteor.user();

    return (typeof user !== 'undefined' && <any> user.roles !== 'undefined');
  }

  /*
    Determines if the user is a student in a particular course
  */
  static isStudentFor(courseid : string){
    let user : any = Meteor.user();

    if(this.isLoggedIn() && typeof user.roles.student === "array"){
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
  static isInstructorFor(courseid : string){
    let user : any = Meteor.user();
    return (this.isLoggedIn() && typeof user.roles.instructor === "array" && user.roles.instructor.contains(courseid));
  }

  /*
    Determines if the user is an administrator for a course
  */
  static isAdministratorFor(courseid : string){
    let user : any = Meteor.user();
    return (this.isLoggedIn() && typeof user.roles.administrator === "array" && (user.roles.administrator.contains('global') || user.roles.administrator.contains(courseid)));
  }

  /*
    Determines if the user is a global administrator
  */
  static isGlobalAdministrator(){
    let user : any = Meteor.user();
    return (this.isLoggedIn() && typeof user.roles.administrator === "array" && user.roles.administrator.contains('global'));
  }
};
