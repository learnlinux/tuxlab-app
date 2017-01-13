/*
 * TuxLab Lab Runtime Class
 * Given a lab model, sets up the cache to
 * @author: Derek Brown, Cem Ersoz
 */

 import * as _ from "underscore";
 import * as vm from 'vm';
 import * as UglifyJS from 'uglify-js';

 import { Config } from '../service/config';
 import { Cache } from '../service/cache';

 import { Lab as LabModel, Task as TaskModel, LabStatus } from '../../../both/models/lab.model';
 import { Labs } from '../../../both/collections/lab.collection';

 import { VMConfig, VMResolveConfig, VMConfigCustom } from '../api/vmconfig';
 import { Lab, isValidLabObject } from '../api/lab'
 import { InitObject, SetupObject, VerifyObject } from '../api/environment';

 /*
  LabSandbox
  Exports Modules for use by Instructors in Labfile
 */
 //TODO test injecting into TuxLab Object
 export const LabSandbox = {
   TuxLab: Lab,
   Lab: {}
 }

 /*
  labFileImportOpts
  Sets options for creating a labfile
 */
 export interface LabFileImportOpts{
   id?: string;
   course_id: string;
   file: string;
 }

 export class LabRuntime extends Cache implements LabModel {
    // LabCache Elements
    protected static _TTL : number = Config.get('labruntime_idle_timeout');

    // Lab Model Elements
    id? : string;
    name: string;
    description?: string;
    course_id: string;
    updated: number;
    status: LabStatus;
    file: string;
    tasks: TaskModel[];

    // Runtime Elements
    private _ready : Promise<LabRuntime>;
    private _sandbox = _.clone(LabSandbox);
    private _context = vm.createContext(this._sandbox);
    private _code;

    public static createLabRuntime(opts : LabFileImportOpts) : Promise<LabRuntime> {
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
            course_id: opts.course_id,
            updated: Date.now(),
            status: LabStatus.hidden,
            file: opts.file,
            tasks: tasks
          }).ready();
        }).then((runtime) => {

          // Add to Database
          let record = {
            name: runtime.name,
            description: runtime.description,
            course_id: opts.course_id,
            updated: Date.now(),
            status: LabStatus.hidden,
            file: opts.file,
            tasks: runtime.tasks
          }

          if (typeof opts.id === "string"){
            Labs.update({ '_id' : opts.id }, record);
          } else {
            opts.id = Labs.insert(record);
          }

          // Set Variables
          runtime.id = opts.id;
          runtime.name = (<Lab>runtime._sandbox.Lab).name;
          runtime.description = (<Lab>runtime._sandbox.Lab).description;

          // Add to Cache
          LabRuntime._cache.set(opts.id, runtime, LabRuntime._TTL, function(err){
            throw err;
          });

          return runtime;
        });
    }

    public static getLabRuntime(lab_id : string) : Promise<LabRuntime> {
      return LabRuntime.cache_keyExists(lab_id).then(function(exists){
        if (exists){

          // Get LabRuntime from Cache
          LabRuntime._cache.get(lab_id, function(err, value){
            if (!err && typeof value !== "undefined"){
              throw "LabRuntimeCache Error";
            } else {

              // Renew in Cache
              LabRuntime.cache_keyRenew(lab_id);
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

    constructor(lab : LabModel){
      super();

      this._ready = new Promise((resolve, reject) => {
        // Compile Lab
        if (typeof lab.file === "string" && lab.file !== ""){
          try{
            this._code = new vm.Script(lab.file, {
                displayErrors: true,
                timeout: Config.get('labruntime_init_timeout')
            });
          } catch (e){
            //TODO: Handle LabInstance Errors
          }
        }

        // Execute Lab
        if (typeof this._code !== 'undefined'){
          try{
            this._code.runInContext(this._context);
          } catch (e) {
            //TODO: Handle LabInstance Errors
          }
        }

        // Validate LabSandbox
        try {
          isValidLabObject(this._sandbox);
        } catch (e) {
          //TODO: Handle LabInstance Errors
        }

        // Copy
        Object.assign(this, lab);
        resolve(this);
      });
    }

    /*
      ready()
      Returns promise confirming the LabRuntime
      is up and running.
    */
    public ready() : Promise<LabRuntime> {
      return this._ready;
    }

    /*
      getVMConfig()
      Returns VMConfig Array
    */
    public getVMConfig() : Promise<VMConfigCustom[]> {
      return this.ready().then(() => {
        if (this._sandbox.Lab instanceof Lab){
          return _.map(this._sandbox.Lab._vm, VMResolveConfig);
        }
      });
    }

    /*
      exec_init()
    */
    public exec_init(obj : InitObject){
      this.ready().then(() => {
        if (this._sandbox.Lab instanceof Lab){
          this._sandbox.Lab._init(obj);
        } else {
          throw "invalidLab";
        }
      });
    }

    /*
      exec_destroy()
    */
    public exec_destroy(obj : InitObject){
      this.ready().then(() => {
        if (this._sandbox.Lab instanceof Lab){
          return this._sandbox.Lab._destroy(obj);
        } else {
          throw "invalidLab";
        }
      });
    }

    /*
      exec_setup()
    */
    public exec_setup(task_id : number, obj : SetupObject){
      this.ready().then(() => {
        if (this._sandbox.Lab instanceof Lab){
          return this._sandbox.Lab._tasks[task_id].setup(obj);
        } else {
          throw "invalidLab";
        }
      });
    }

    /*
      exec_verify()
    */
    public exec_verify(task_id : number, obj : VerifyObject){
      this.ready().then(() => {
        if (this._sandbox.Lab instanceof Lab){
          this._sandbox.Lab._tasks[task_id].verify(obj);
        } else {
          throw "invalidLab";
        }
      })
    }

 }
