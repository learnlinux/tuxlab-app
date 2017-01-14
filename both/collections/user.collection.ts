
/**
  IMPORTS
**/
  import { Meteor } from 'meteor/meteor'
  import { Mongo } from 'meteor/mongo'
  import { MongoObservable } from 'meteor-rxjs';

  import { UserSchema } from '../schemas/user.schema';
  import { User, Role, Privilege } from '../models/user.model';

  import { CourseRecords } from './course_record.collection';

/**
  CREATE USER COLLECTION
**/

  class UserCollection extends Mongo.Collection<User> {

    constructor(){
      super('users');
      this.attachSchema(UserSchema);
    }

    private getPrivilegeFor(course_id : string, user_id : string) : Privilege {
      let user : User = this.findOne(user_id);
      if (typeof user === "undefined"){
        undefined;
      } else {
        let role = _.find(user.roles, function(priv){
          return priv.course_id = course_id;
        });

        return role;
      }
    }

    public getRoleFor(course_id : string, user_id : string) : Role {
      let res = this.getPrivilegeFor(course_id, user_id);
      if (this.isGlobalAdministrator(user_id)){
        return Role.global_admin;
      } else if (typeof res === "undefined") {
        return Role.guest;
      } else {
        return res.role;
      }
    }

    public getCourseRecordFor(course_id : string, user_id : string) : string {
      let res = this.getPrivilegeFor(course_id, user_id);
      if (typeof res === "undefined") {
        return undefined;
      } else {
        return res.course_record;
      }
    }

    public setRoleFor(course_id: string, user_id: string, role : Role) : void {

      // Check if Course Record Created
      let course_record_id;
      if (this.getRoleFor(course_id, user_id) == Role.guest) {
        course_record_id = CourseRecords.insert({
          user_id : user_id,
          course_id: course_id,
          labs: []
        });
      } else {
        course_record_id = this.getCourseRecordFor(course_id, user_id);
      }

      // Set Role in User Database
      let record : Privilege = {
        course_id : course_id,
        course_record : course_record_id,
        role: role
      }

      this.update({ _id : user_id }, { '$pull' : {'roles' : {'course_id' : course_id}}});
      this.update({ _id : user_id }, { '$push' : {'roles' : record}});
    }

    // isGlobalAdministrator
     public isGlobalAdministrator (user_id : string) : boolean {
      let user : User = this.findOne(user_id);
      return (typeof user !== "undefined") && (user.global_admin);
    }

  }
  export const Users = new UserCollection();
