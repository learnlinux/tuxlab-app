
/**
  IMPORTS
**/
  import { Meteor } from 'meteor/meteor'
  import { Mongo } from 'meteor/mongo'
  import { MongoObservable } from 'meteor-rxjs';

  import { SessionSchema } from '../schemas/session.schema'
  import { Session } from '../models/session.model'

/**
  CREATE USER COLLECTION
**/
  export const Sessions = new Mongo.Collection<Session>('sessions');

  // Attach Schema
  Sessions.attachSchema(SessionSchema);

  // Create User Observable
  export const SessionsObsv = new MongoObservable.Collection<Session>(Sessions);
