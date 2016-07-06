import {Component} from '@angular/core'
import {Meteor} from 'meteor/meteor';

/***
  USER ROLES
***/
export class Roles {

  /*
    Determines if user is logged in
  */
  static isLoggedIn(){
    let user = Meteor.user().profile;
    return (typeof user !== 'undefined' && user.roles !== 'undefined');
  }

  /*
    Determines if the user is a student in a particular course
  */
  static isStudentFor(courseid){
    let user = Meteor.user().profile;
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
  static isInstructorFor(courseid){
    let user = Meteor.user().profile;
    return (this.isLoggedIn() && typeof user.roles.instructor === "array" && user.roles.instructor.contains(courseid));
  }

  /*
    Determines if the user is an administrator for a course
  */
  static isAdministratorFor(courseid){
    let user = Meteor.user().profile;
    return (this.isLoggedIn() && typeof user.roles.administrator === "array" && (user.roles.administrator.contains('global') || user.roles.administrator.contains(courseid)));
  }

  /*
    Determines if the user is a global administrator
  */
  static isGlobalAdministrator(){
    let user = Meteor.user().profile;
    return (this.isLoggedIn() && typeof user.roles.administrator === "array" && user.roles.administrator.contains('global'));
  }
};
