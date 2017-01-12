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
    protected abstract _TTL : number;

    constructor(){
      this._cache = new NodeCache({
        errorOnMissing: true,
        useClones: false
      });
    }

    public exists(key : string) : Promise<boolean>{
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

    public renew(key : string) : Promise<{}> {
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
