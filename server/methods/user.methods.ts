import * as _ from "lodash";
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import { User, Role } from "../../both/models/user.model";
import { Users } from "../../both/collections/user.collection";

import { Courses } from '../../both/collections/course.collection';

import { CourseRecords } from '../../both/collections/course_record.collection';

import { Sessions } from '../../both/collections/session.collection';

/* PUBLICATIONS */

// PERSONAL DATA
Meteor.publish("userData", () => {
    return Meteor.users.find({
      _id: Meteor.userId()
    }, {
      fields: {'global_admin': 1, 'roles': 1}
    });
});

// INSTRUCTORS
Meteor.publish("users.instructors", (course_id) => {
  var course = Courses.findOne({ _id : course_id });
  if(course){
    return Users.find({
      _id : { $in : course.instructors }
    },{
      fields: { "_id" : 1, "roles" : 1, "profile.name" : 1 }
    });
  } else {
    throw new Meteor.Error("Could not find course");
  }
})

// COURSE USERS
Meteor.publish("users.course", (course_id) => {
  if(!Meteor.userId()){
    throw new Meteor.Error("Unauthorized");
  }

  switch(Users.getRoleFor(course_id, Meteor.userId())){
    case Role.instructor:
    case Role.course_admin:
    case Role.global_admin:
      return Users.find({
        "roles" : {
          "$elemMatch" : {
            "course_id" : course_id
          }
        }
      })
    case Role.student:
    case Role.guest:
      throw new Meteor.Error("Unauthorized");
  }
})

// ALL USERS
Meteor.publish("users.all", () => {
  if(!Meteor.userId()){
    throw new Meteor.Error("Unauthorized");
  } else if(Users.isGlobalAdministrator(Meteor.userId())) {
      return Users.find({});
  } else {
      throw new Meteor.Error("Unauthorized");
  }
});

/* ROLE GRANTING */

  function canGrantRoleForCourse(course_id : string, role : Role) : boolean{
    switch(Users.getRoleFor(course_id, Meteor.userId())){
      case Role.global_admin:
      case Role.course_admin:
        return (_.includes([Role.course_admin, Role.instructor, Role.student, Role.guest],role));
      case Role.instructor:
        return (_.includes([Role.instructor, Role.student, Role.guest],role));
      default:
        return false;
    }
  }

  export function addRoleForCourse(course_id : string, user_id : string, role : Role) : Promise<any>{
    // Add to User Roles
    return new Promise((resolve, reject) => {
      Users.update({
        _id : user_id
      }, {
        $pull : { roles : { course_id : course_id }}
      }, (err, res) =>{
        if(err){
          reject(err)
        } else {
          resolve();
        }
      })
    })

    .then(() => {
      return new Promise((resolve, reject) => {
        Users.update({
          _id : user_id
        }, {
          $push : { roles : { course_id : course_id, role : role}}
        }, (err, res) =>{
          if(err){
            reject(err)
          } else {
            resolve();
          }
        })
      })
    })

    // Add to Course Instructors List
    .then(() => {
      return new Promise((resolve, reject) => {
        Courses.update({
          _id : course_id
        },{
          $addToSet: { instructors : user_id }
        }, (err, res) => {
          if(err){
            reject(err);
          } else {
            resolve(res);
          }
        })
      });
    })
  }

  export function removeRoleForCourse(course_id : string, user_id : string, role : Role) : Promise<any>{

    // Remove from Course Instructors List
    return new Promise((resolve, reject) => {
      Users.update({
        _id : user_id
      }, {
        $pull : {
          roles : {
            $and : [
              { course_id : course_id },
              { role : role }
            ]
          }
        }
      }, (err, res) => {
        if(err){
          reject(err);
        } else {
          resolve(res);
        }
      })
    })

    // Remove from User Roles
    .then(() => {
      return new Promise((resolve, reject) => {
        Courses.update({
          _id : course_id
        }, {
          $pull : { instructors : user_id }
        }, (err, res) => {
          if(err){
            reject(err);
          } else {
            resolve(res);
          }
        });
      })
    })
  }

  export function removeFromCourse(course_id, user_id){

      // Remove from Course Instructors List
      return new Promise((resolve, reject) => {
        Users.update({
          _id : user_id
        }, {
          $pull : {
            roles : {
              $and : [
                { course_id : course_id }
              ]
            }
          }
        }, (err, res) => {
          if(err){
            reject(err);
          } else {
            resolve(res);
          }
        })
      })

      // Remove from User Roles
      .then(() => {
        return new Promise((resolve, reject) => {
          Courses.update({
            _id : course_id
          }, {
            $pull : { instructors : user_id }
          }, (err, res) => {
            if(err){
              reject(err);
            } else {
              resolve(res);
            }
          });
        })
      })
  }

/* METEOR METHODS */


  Meteor.methods({
    'Users.search'({query}){
      return Users.find({
        $or : [
          { "_id" : query },
          { "profile.name" : { $regex : query, $options : 'i' } },
          { "profile.email" : { $regex : query, $options : 'i' } }
        ]
      },{
        fields : {"_id" : 1, "profile.name" : 1}
      }).fetch();
    },

    'Users.sendPasswordEmail'({query}){

      var user = Users.findOne({
        $or : [
          { "_id" : query },
          { "profile.email " : query }
        ]
      })

      if(user){
        Accounts.sendResetPasswordEmail(user._id);
      } else {
        throw new Meteor.Error("No Matching User Found");
      }

    },

    'Users.remove'({user_id}){
      if(!Meteor.userId()){
        throw new Meteor.Error("Unauthorized");

      } else if(Users.isGlobalAdministrator(Meteor.userId()) || Meteor.userId() === user_id) {

        // Delete User
        Users.remove({ _id : user_id });

        // Delete Course Records
        CourseRecords.remove({ user_id : user_id });

        // Expire Sessions
        Sessions.update({
          user_id : user_id
        }, {
          "$set" : {
            expires : new Date()
          }
        })

      } else {
        throw new Meteor.Error("Unauthorized");
      }
    },

    'Users.addRoleForCourse'({course_id, user_id, role}){

      // Check Privilege
      return new Promise((resolve, reject) => {
        if(canGrantRoleForCourse(course_id, role)){
          resolve();
        } else {
          reject();
        }
      }).catch(() => {
        throw new Meteor.Error("Insufficient Privilege");
      })

      // Add Role
      .then(() => {
        return addRoleForCourse(course_id, user_id, role);
      }).catch((err) => {
        throw new Meteor.Error("Could not add role for course");
      })

    },

    'Users.removeFromCourse'({course_id, user_id}){

      // Check Privilege
      return new Promise((resolve, reject) => {
        if(!Meteor.userId()){
          throw new Meteor.Error("Unauthorized");
        }

        if (user_id === Meteor.userId()){
          return resolve();
        } else {
          switch(Users.getRoleFor(course_id, Meteor.userId())){
            case Role.global_admin:
              return resolve();
            case Role.course_admin:
            case Role.instructor:
            case Role.student:
            case Role.guest:
              throw new Meteor.Error("Unauthorized");
          }
        }
      })

      // Remove Role
      .then(() => {
        return removeFromCourse(course_id, user_id);
      }).catch((err) => {
        throw new Meteor.Error("Co");
      })

    },

    'Users.removeRoleForCourse'({course_id, user_id, role}){

      // Check Privilege
      return new Promise((resolve, reject) => {
        if(canGrantRoleForCourse(course_id, role)){
          resolve();
        } else {
          reject();
        }
      }).catch(() => {
        throw new Meteor.Error("Insufficient Privilege");
      })

      // Remove Role
      .then(() => {
        return removeRoleForCourse(course_id, user_id, role);
      }).catch((err) => {
        throw new Meteor.Error("Could not remove role for course");
      })
    },

    'Users.setGlobalAdministrator'({user_id, is_global_admin}){
      if(!Meteor.userId()){
        throw new Meteor.Error("Unauthorized");
      } else if(Users.isGlobalAdministrator(Meteor.userId())) {
        Users.setGlobalAdministrator(user_id, is_global_admin);
      } else {
        throw new Meteor.Error("Unauthorized");
      }
    }
  })
