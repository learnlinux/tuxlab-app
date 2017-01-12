

  import { Cache } from './cache';
  import { ConfigService } from './config';

/*
   SessionCache
*/
  class SessionObjCache extends Cache {
     protected _TTL : number;

     constructor(TTL : number){
       super();
       this._TTL = TTL;
     }

     //TODO: NOTE TO SELF, SessionCache needs to be shared across Meteor instances
     //so make sure to appropriately cache to both the object cache and etcd.
     // also be sure to throw errors if a user creates a second session with the same
     // labid and userid and that session is still active.
     //
     // TODO: create functionality to persist sessions to database.

  }
  export const SessionCache = new SessionObjCache(ConfigService.get('session_idle_timeout'));
