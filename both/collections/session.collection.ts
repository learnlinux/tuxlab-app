
/**
  IMPORTS
**/
  import { Meteor } from 'meteor/meteor'
  import { Mongo } from 'meteor/mongo'

  import { SessionSchema } from '../schemas/session.schema';
  import { Session } from '../models/session.model';

/**
  CREATE SESSION COLLECTION
**/
  export const Sessions = new SessionCollection();
  class SessionCollection extends Mongo.Collection<Session> {
    constructor(){
      super('sessions');
      this.attachSchema(SessionSchema);
    }
  }
