
/**
  IMPORTS
**/
  import { Meteor } from 'meteor/meteor';
  import { Mongo } from 'meteor/mongo'
  import { MongoObservable } from 'meteor-rxjs';

  import { LabSchema } from '../models/lab.schema'
  import { Lab } from '../models/lab.model'
  import { Roles } from '../collections/user.collection'

/**
  CREATE USER COLLECTION
**/
  export const Labs = new Mongo.Collection<Lab>('labs');

  // Attach Schema
  Labs.attachSchema(LabSchema);

  // Set Editing Permissions
  let isAuthorized = function(user_id : string, lab : Lab){
      return Roles.isGlobalAdministrator(user_id) ||
             Roles.isAdministratorFor(lab.course_id,user_id);
  }

  Labs.allow({
    insert: isAuthorized,
    update: isAuthorized,
    remove: isAuthorized,
    fetch: ["course_id"]
  });

  // Create Observable
  export const LabsObsv = new MongoObservable.Collection<Lab>(Labs);
