
/**
  IMPORTS
**/
  import { Meteor } from 'meteor/meteor'
  import { Mongo } from 'meteor/mongo'
  import { MongoObservable } from 'meteor-rxjs';

  import { SessionSchema } from '../schemas/session.schema';
  import { Session } from '../models/session.model';

  import { Users } from './user.collection';

/**
  CREATE SESSION COLLECTION
**/
  class SessionCollection extends Mongo.Collection<Session> {
    public observable : MongoObservable.Collection<Session>;

    constructor(){
      super('sessions');
      this.attachSchema(SessionSchema);

      // Set Permissions
      super.allow({
        insert: function(user_id : string) { return Users.isGlobalAdministrator(user_id) },
        update: function(user_id : string) { return Users.isGlobalAdministrator(user_id) },
        remove: function(user_id) { return Users.isGlobalAdministrator(user_id) }
      });

      // Create Observable
      this.observable = new MongoObservable.Collection(this);
    }
  }
  export const Sessions = new SessionCollection();
