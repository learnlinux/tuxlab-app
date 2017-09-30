
/**
  IMPORTS
**/

  import * as _ from "lodash";
  import { Meteor } from 'meteor/meteor';
  import { Mongo } from 'meteor/mongo';
  import { MongoObservable, ObservableCursor } from 'meteor-rxjs';

  import { UserSchema } from '../schemas/user.schema';

  import { User, Role, Privilege } from '../models/user.model';
  import { Course } from '../models/course.model';

  import { CourseRecords } from './course_record.collection';
  import { Courses } from './course.collection';




/**
  EXTEND USER COLLECTION
**/

    /* INTERFACE */
    interface UsersCollection extends Mongo.Collection<User> {
      observable : MongoObservable.Collection<User>;
      getPrivilegeFor(course_id : string, user_id : string) : Privilege;
      getCoursesFor(user_id : string) : ObservableCursor<Course>;
      getRoleFor(course_id : string, user_id : string) : Role;
      getCourseRecordFor(course_id : string, user_id : string) : string;
      ensureRoleFor(course_id: string, user_id: string, role : Role) : void;
      setRoleFor(course_id: string, user_id: string, role : Role) : void;
      isGlobalAdministrator(user_id: string) : boolean;
      setGlobalAdministrator(user_id: string, is_global_admin : boolean) : void;
      findByProfileFields(query : string) : ObservableCursor<User>;
    }

    var UsersCollection : UsersCollection = (<UsersCollection>Meteor.users);
        UsersCollection.observable = new MongoObservable.Collection(UsersCollection);

    /* IMPLEMENTATION */
    // getPrivilegeFor
    UsersCollection.getPrivilegeFor = function(course_id : string, user_id : string) : Privilege | null {
      let user : User = this.findOne(user_id);

      if(typeof user !== "undefined" && _.has(user, "roles")){
        return _.find(user.roles, function(rec){
          return rec.course_id == course_id;
        });
      } else {
        return null;
      }
    }

    // getRoleFor
    UsersCollection.getRoleFor = function(course_id : string, user_id : string) : Role {
      let res = this.getPrivilegeFor(course_id, user_id);

      if (this.isGlobalAdministrator(user_id)){
        return Role.global_admin;
      } else if (_.isUndefined(res) || _.isNull(res)) {
        return Role.guest;
      } else {
        return res.role;
      }
    }

    // getCoursesFor
    UsersCollection.getCoursesFor = function(user_id : string) : ObservableCursor<Course> {

      // Get User
      const user = Users.observable.findOne({ '_id' : user_id });

      // Iterate over Roles to get Courses
      var courses = [];
      if(user){
        courses = _.map(_.filter(user.roles, (priv : Privilege) => {
          return priv.role >= Role.student;
        }), (priv : Privilege) => {
          return priv.course_id;
        });
      }

      // Map to Find Courses
      return Courses.observable.find({ '_id' : { '$in' : courses }});
    }

    // getCourseRecordFor
    UsersCollection.getCourseRecordFor = function(course_id : string, user_id : string) : string {
      let res = this.getPrivilegeFor(course_id, user_id);
      if (typeof res === "undefined") {
        return undefined;
      } else {
        return res.course_record;
      }
    }

    // ensureRoleFor
    // Ensures the user has AT LEAST the given permissions level
    UsersCollection.ensureRoleFor = function(course_id: string, user_id: string, role : Role) : void {

      // Check if Course Record Created
      let course_record_id;
      if (this.getRoleFor(course_id, user_id) == Role.guest) {
        course_record_id = CourseRecords.insert({
          user_id : user_id,
          course_id: course_id,
          labs: {}
        });
      } else {
        course_record_id = this.getCourseRecordFor(course_id, user_id);
      }

      // Add Role if not Found
      this.update({
        _id : user_id,
        "roles" : {
          "$not" : {
            "$elemMatch" : {
              "course_id" : course_id,
              "role" : {
                "$gte" : role
              }
            }
          }
        }
      }, {
        "$push" : {
          "roles" : {
            course_id : course_id,
            role: role
          }
        }
      });


    }

    // setRoleFor
    UsersCollection.setRoleFor = function(course_id: string, user_id: string, role : Role) : void {
      // Check if Course Record Created
      let course_record_id;
      if (this.getRoleFor(course_id, user_id) == Role.guest) {
        course_record_id = CourseRecords.insert({
          user_id : user_id,
          course_id: course_id,
          labs: {}
        });
      } else {
        course_record_id = this.getCourseRecordFor(course_id, user_id);
      }

      // Set Role in User Database
      let record : Privilege = {
        course_id : course_id,
        role: role
      }

      this.update({ _id : user_id }, { '$pull' : {'roles' : {'course_id' : course_id}}});
      this.update({ _id : user_id }, { '$push' : {'roles' : record}});
    }

    // setGlobalAdministrator
    UsersCollection.setGlobalAdministrator = function(user_id : string, is_global_admin : boolean) : void {
      this.update({
        "_id" : user_id
      }, {
        "$set" : {
          "global_admin" : is_global_admin
        }
      });
    }

    // isGlobalAdministrator
    UsersCollection.isGlobalAdministrator = function(user_id : string) : boolean {
      let user : User = this.findOne(user_id);
      return (typeof user !== "undefined") && (user.global_admin);
    }

    export const Users = UsersCollection;
