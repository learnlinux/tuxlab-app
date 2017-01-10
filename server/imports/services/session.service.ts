

  import { TuxCache } from './cache.service';
  import { ConfigService } from './config.service';

/*
   SessionCache
*/
  class SessionObjCache extends TuxCache {
     protected _TTL : number;

     constructor(TTL : number){
       super();
       this._TTL = TTL;
     }

  }
  export const SessionCache = new SessionObjCache(ConfigService.get('session_idle_timeout'));
