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
 //TODO Prevent hacking by injecting into TuxLab object.
 export const LabSandbox = {
   TuxLab: Lab,
   Lab: {},
   Environment: {}
 }

 /*
  labFileImportOpts
  Sets options for creating a labfile
 */
 export interface LabFileImportOpts{
   _id?: string;
   course_id: string;
   file: string;
 }

 export class LabRuntime extends Cache implements LabModel {
    // LabCache Elements
    protected static _TTL : number = Config.get('labruntime_idle_timeout');

    // Lab Model Elements
    _id? : string;
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
          const comment_filter = /\/\*( |\n)*?@(.*?)(\n)((.|\n)*?)\*\//gm;
          let tasks = [], comment = [], index = 0;
          while ((comment = comment_filter.exec(opts.file)) !== null){
            tasks.push ({
              id: (index += 1),
              name: comment[2].replace(/[^\w\s]/gi, '').trim(), // Remove special characters
              md: comment[4]
            });
          }

          // Uglify JS to minimize Storage
          let code = "";
          try {
            let code = (UglifyJS.minify(opts.file, {fromString: true})).code;
          } catch (e){
            reject("uglifyError");
          }

          // Create LabRun
          resolve(new LabRuntime({
            course_id: opts.course_id,
            updated: Date.now(),
            status: LabStatus.hidden,
            file: opts.file,
            tasks: tasks
          }));
        }).then((runtime) => {
          return runtime.ready();
        }).then((runtime) => {

          // Set Variables
          runtime._id = opts._id;
          runtime.name = (<Lab>runtime._sandbox.Lab).name;
          runtime.description = (<Lab>runtime._sandbox.Lab).description;

          // Add to Database
          let record : LabModel = {
            name: runtime.name,
            description: runtime.description,
            course_id: opts.course_id,
            updated: Date.now(),
            status: LabStatus.hidden,
            file: opts.file,
            tasks: runtime.tasks
          }

          if (typeof opts._id === "string"){
            Labs.update({ '_id' : opts._id }, record);
          } else {
            runtime._id = Labs.insert(record);
          }

          // Add to Cache
          LabRuntime._cache.set(runtime._id, runtime, LabRuntime._TTL);

          return runtime;
        });
    }

    public static getLabRuntime(lab_id : string) : Promise<LabRuntime> {
      return LabRuntime.cache_keyExists(lab_id).then(function(exists){
        if (exists){
          return new Promise(function(resolve,reject){
              // Get LabRuntime from Cache
              LabRuntime._cache.get(lab_id, function (err, value: LabRuntime){
                if (!err && typeof value !== "undefined"){
                  LabRuntime.cache_keyRenew(lab_id); // Renew Key
                  resolve(value);
                } else {
                  reject(err);
                }
              });
          });
        } else {
          return new Promise((resolve, reject) => {

            let lab_model = Labs.findOne({ _id : lab_id});

            if (typeof lab_model === "undefined"){
              reject(new Error("LabNotFound"));

            } else {
              let runtime = new LabRuntime(lab_model);

              // Store LabRuntime in Cache
              LabRuntime._cache.set(lab_id, runtime, this._TTL, function(err){
                if (err) {
                  reject(err);
                } else {
                  resolve(runtime);
                }
              });
            }
          });
        }
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
            reject(e);
          }
        }

        // Execute Lab
        if (typeof this._code !== 'undefined'){
          try{
            this._code.runInContext(this._context);
          } catch (e) {
            reject(e);
          }
        }

        // Validate LabSandbox
        try {
          isValidLabObject(this._sandbox);
        } catch (e) {
          reject(e);
        }

        // Copy Variables from Constructor
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
          this._sandbox.Environment = obj;
          return vm.runInContext("Lab._init(Environment)",this._context);
        } else {
          throw new Error("invalidLab");
        }
      });
    }

    /*
      exec_destroy()
    */
    public exec_destroy(obj : InitObject){
      this.ready().then(() => {
        if (this._sandbox.Lab instanceof Lab){
          this._sandbox.Environment = obj;
          return vm.runInContext("Lab._destroy(Environment)",this._context);
        } else {
          throw new Error("invalidLab");
        }
      });
    }

    /*
      exec_setup()
    */
    public exec_setup(task_id : number, obj : SetupObject){
      this.ready().then(() => {
        if (this._sandbox.Lab instanceof Lab){
          this._sandbox.Environment = obj;
          return vm.runInContext("Lab._tasks["+task_id+"].setup(Environment)",this._context);
        } else {
          throw new Error("invalidLab");
        }
      });
    }

    /*
      exec_verify()
    */
    public exec_verify(task_id : number, obj : VerifyObject){
      this.ready().then(() => {
        if (this._sandbox.Lab instanceof Lab){
          this._sandbox.Environment = obj;
          return vm.runInContext("Lab._tasks["+task_id+"].verfiy(Environment)",this._context);
        } else {
          throw new Error("invalidLab");
        }
      })
    }

 }
