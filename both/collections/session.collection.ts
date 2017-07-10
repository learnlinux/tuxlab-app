
/**
  IMPORTS
**/
  import { Meteor } from 'meteor/meteor'
  import { Mongo } from 'meteor/mongo'
  import { MongoObservable } from 'meteor-rxjs';

  import { SessionSchema } from '../schemas/session.schema';
  import { Session } from '../models/session.model';

/**
  CREATE SESSION COLLECTION
**/
  class SessionCollection extends Mongo.Collection<Session> {
    public observable : MongoObservable.Collection<Session>;

    constructor(){
      super('sessions');
      this.attachSchema(SessionSchema);

      // Create Observable
      this.observable = new MongoObservable.Collection(this);
    }
  }
  export const Sessions = new SessionCollection();
