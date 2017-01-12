/*
 * TuxLab Lab Runtime Service
 * @author: Derek Brown, Cem Ersoz
 */

import { Lab } from '../../../both/models/lab.model';
import { Labs } from '../../../both/collections/lab.collection';

import { LabRuntime, LabFileImportOpts } from '../runtime/lab_runtime';

import { Cache } from './cache';
import { ConfigService } from './config';

/*
   LabRuntimeCache
*/
  class LabRuntimeCache extends Cache {
    protected _TTL : number;

    constructor(TTL : number){
      super();
      this._TTL = TTL;
    }

    public importLabRuntime(opts : LabFileImportOpts) : Promise<LabRuntime> {
      return LabRuntime.fileImport(opts).then(function(runtime : LabRuntime){

        // Add to Cache
        this._cache.set(opts._id, runtime, this._TTL, function(err){
          //TODO log error
        });

        return runtime;
      });
    }

    public getLabRuntime(lab_id : string) : Promise<LabRuntime> {
      return super.exists(lab_id).then(function(exists){
        if (exists){

          // Get LabRuntime from Cache
          this._cache.get(lab_id, function(err, value){
            if (!err && typeof value !== "undefined"){
              throw "LabRuntimeCache Error";
            } else {
              return value;
            }
          });

        } else {

          // Create LabRuntime from Database
          let runtime = new LabRuntime(Labs.findOne({ _id : lab_id}));

          // Store LabRuntime in Cache
          this._cache.set(lab_id, runtime, this._TTL, function(err){
            //TODO log error
          });

          // Return Runtime
          return runtime;
        }

      }).catch(function(err){
        throw "LabRuntimeCache Error";
      });
    }
  }
  export const LabRuntimeService = new LabRuntimeCache(ConfigService.get('labruntime_idle_timeout'));
