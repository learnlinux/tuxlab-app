/*
 * lab_runtime.ts
 * service which provides access to cached lab_runtimes.
 */

 import * as _ from 'underscore';
 import * as NodeCache from 'node-cache';

 /*
    NodeCache Wrapper
 */
 export abstract class Cache {
    protected _cache : NodeCache;
    protected  _TTL : number;

    constructor(TTL : number){
      this._TTL = TTL;
      this._cache = new NodeCache({
        errorOnMissing: true,
        useClones: false
      });
    }

    protected exists(key : string) : Promise<boolean>{
      return new Promise((resolve, reject) => {
        this._cache.getTtl(key, (err, success) => {
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

    protected renew(key : string) : Promise<{}> {
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
