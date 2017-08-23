import * as _ from "lodash";
import { Meteor } from 'meteor/meteor';

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

    'Users.remove'({user_id}){
      if(!Meteor.userId()){
        throw new Meteor.Error("Unauthorized");
      } else if(Users.isGlobalAdministrator(Meteor.userId())) {

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

      // Add Role
      .then(() => {
        return removeRoleForCourse(course_id, user_id, role);
      }).catch((err) => {
        throw new Meteor.Error("Could not add role for course");
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
