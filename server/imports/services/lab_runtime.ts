/*
 * TuxLab Lab Runtime Service
 * @author: Derek Brown, Cem Ersoz
 */

import * as UglifyJS from 'uglify-js';

import { Lab, LabStatus } from '../../../both/models/lab.model';
import { Labs } from '../../../both/collections/lab.collection';

import { LabRuntime } from '../runtime/lab_runtime';

import { Cache } from './cache';
import { ConfigService } from './config';


/*
 labFileImportOpts
 Sets options for creating a labfile
*/
export interface LabFileImportOpts{
  _id?: string;
  name: string;
  course_id: string;
  file: string;
}


/*
   LabRuntimeCache
*/
  class LabRuntimeCache extends Cache {

    constructor(TTL : number){
      super(TTL);
    }

    public createLabRuntime(opts : LabFileImportOpts) : Promise<LabRuntime> {
        return new Promise<LabRuntime>((resolve, reject) => {
          // Regex for Markdown in Comments
          const comment_filter = /\/\*( |\n)*?@(.*?)( |\n)((.|\n)*?)\*\//gm;
          const title_filter = /\/\*( |\n)*?@(.*?)( |\n)((.|\n)*?)\*\//gm;

          let comments = opts.file.match(comment_filter);
          let tasks = comments.map((comment, index, arr) => {
            let markdown = title_filter.exec(comment);
            return {
              id: (index + 1),
              name: markdown[2],
              md: markdown[4]
            }
          });

          // Uglify JS to minimize Storage
          let code = "";
          try {
            let code = (UglifyJS.minify(opts.file, {fromString: true})).code;
          } catch (e){
            reject("uglifyError");
          }

          // Create LabRun
          return new LabRuntime({
            name: opts.name,
            course_id: opts.course_id,
            updated: Date.now(),
            status: LabStatus.hidden,
            file: opts.file,
            tasks: tasks
          }).ready();
        }).then((runtime) => {

          // Add to Cache
          this._cache.set(opts._id, runtime, this._TTL, function(err){
            //TODO log error
          });

          //TODO Add to Database

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
