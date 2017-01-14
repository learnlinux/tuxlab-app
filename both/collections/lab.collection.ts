
/**
  IMPORTS
**/
  import { Meteor } from 'meteor/meteor';
  import { Mongo } from 'meteor/mongo'

  import { LabSchema } from '../schemas/lab.schema';
  import { Lab } from '../models/lab.model';
  import { Role } from '../models/user.model';
  import { Users } from '../collections/user.collection';

/**
  CREATE USER COLLECTION
**/
  class LabCollection extends Mongo.Collection<Lab> {
    constructor(){
      super('labs');
      this.attachSchema(LabSchema);

      // Set Editing Permissions
      let isAuthorized = function(user_id : string, lab : Lab){
          return Users.getRoleFor(user_id, lab.course_id) >= Role.course_admin;
      }

      this.allow({
        insert: isAuthorized,
        update: isAuthorized,
        remove: isAuthorized,
        fetch: ["course_id"]
      });
    }
  }
  export const Labs = new LabCollection();
