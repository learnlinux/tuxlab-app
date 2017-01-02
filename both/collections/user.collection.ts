
/**
  IMPORTS
**/
  import { Meteor } from 'meteor/meteor'
  import { Mongo } from 'meteor/mongo'
  import { MongoObservable } from 'meteor-rxjs';

  import { UserSchema } from '../schemas/user.schema'
  import { User, Role } from '../models/user.model'

/**
  CREATE USER COLLECTION
**/
  export const Users = new Mongo.Collection<User>('users');

  // Attach Schema
  Users.attachSchema(UserSchema);

  // Create User Observable
  export const UsersObsv = new MongoObservable.Collection<User>(Users);

/**
  DEFINE USER ROLES METHODS
**/
  export class Roles {

      // Get User by ID
      private static fromID(user_id : string) {
          return Meteor.users.findOne(user_id);
      }

      // Checked if Logged In
      public static isLoggedIn(user){
        return (typeof user !== 'undefined') && (user !== null);
      }

      // isStudentFor
      public static isStudentFor(course_id: string, user_id : string){
        let user : User = Roles.fromID(user_id);
        return Roles.isLoggedIn(user) &&
               (user.roles.student.map(function(role){ return role.course_id }).indexOf(course_id) >= 0);
      }

      // isInstructorFor
      public static isInstructorFor(course_id: string, user_id : string){
        let user : User = Roles.fromID(user_id);
        return Roles.isLoggedIn(user) &&
               (user.roles.instructor.map(function(role){ return role.course_id }).indexOf(course_id) >= 0);
      }

      // isAdministratorFor
      public static isAdministratorFor(course_id: string, user_id : string){
        let user : User = Roles.fromID(user_id);

        return Roles.isLoggedIn(user) &&
               (user.roles.global_admin ||
               (user.roles.administrator.map(function(role){ return role.course_id }).indexOf(course_id) >= 0));

      }

      // isGlobalAdministrator
      public static isGlobalAdministrator(user_id : string){
        let user : User = Roles.fromID(user_id);
        return Roles.isLoggedIn(user) && user.roles.global_admin;
      }

  }
