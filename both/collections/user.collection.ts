
/**
  IMPORTS
**/
  import { Meteor } from 'meteor/meteor'
  import { Mongo } from 'meteor/mongo'
  import { MongoObservable } from 'meteor-rxjs';

  import { UserSchema } from '../schemas/user.schema';
  import { User, Role } from '../models/user.model';

/**
  CREATE USER COLLECTION
**/

  export const Users = new UserCollection();
  class UserCollection extends Mongo.Collection<User> {

    constructor(){
      super('users');
      this.attachSchema(UserSchema);
    }

    // getRoleFor
    public getRoleFor(course_id : string, user_id : string) : Role {
      let user : User = this.findOne(user_id);
      if (typeof user === "undefined"){
        return 0;
      } else if (user.global_admin){
        return 4;
      } else {
        let role = _.find(user.roles, function(priv){
          return priv.course_id = course_id;
        });

        return role.role;
      }
    }

    // setRoleFor
    public setRoleFor(course_id: string, user_id: string, role : Role) : void {
      //TODO Implement
    }

    // isGlobalAdministrator
     public isGlobalAdministrator (user_id : string) : boolean {
      let user : User = this.findOne(user_id);
      return (typeof user !== "undefined") && (user.global_admin);
    }

  }
