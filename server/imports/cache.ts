import * as _ from 'underscore';
import * as NodeCache from 'node-cache';

/*
   NodeCache Wrapper
*/
export abstract class Cache {
   protected static _cache : NodeCache =
     new NodeCache({
       errorOnMissing: true,
       useClones: false,
       stdTTL: Cache._TTL
     });
   protected abstract static _TTL : number;

   protected static cache_keyExists(key : string) : Promise<boolean>{
     return new Promise((resolve, reject) => {
       this._cache.get(key, (err, success) => {
         if (!err && success){
           resolve(true);
         } else if (!err && !success){
           resolve(false);
         } else {
           reject();
         }
       })
     });
   }

   protected static cache_keyRenew(key : string) : Promise<{}> {
     return new Promise(function(resolve, reject){
       this._cache(key, this._TTL, function(err, changed){
         if (!err && changed){
           resolve();
         } else {
           reject();
         }
       });
     });
   }
}
