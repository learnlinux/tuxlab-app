/*
 * TuxLab Lab Runtime Class
 * Given a lab model, sets up the cache to
 * @author: Derek Brown, Cem Ersoz
 */

 import * as _ from "lodash";
 import * as vm from 'vm';
 import * as UglifyJS from 'uglify-es';

 import { Cache } from '../service/cache';
 import { log } from '../service/log';
 import { clientConsole } from '../service/console';

 import { Lab as LabModel, Task as TaskModel, LabStatus, LabFileImportOpts } from '../../../both/models/lab.model';
 import { Labs } from '../../../both/collections/lab.collection';

 import { VMConfig, VMResolveConfig, VMConfigCustom } from '../api/vmconfig';
 import { Lab, isValidLabObject } from '../api/lab'
 import { InitObject, SetupObject, VerifyObject } from '../api/environment';

 /*
  LabSandbox
  Exports Modules for use by Instructors in Labfile
 */
 export const LabSandbox = {

   // TuxLab Resources
   TuxLab: Lab,
   Lab: {},
   Environment: {},

   // Standard Library
   console: clientConsole,
   Promise : Promise,

   // Extended Library
   _ : _, // Lodash
   rp : require('request-promise') // Request-Promise

 }

 export class LabRuntime extends Cache implements LabModel {

    // LabCache Elements
    protected static _TTL : number = Meteor.settings['private']['labvm']['labruntime_idle_timeout'];

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

    // Lab Context Options
    private LabContextOptions() {
      return {
        filename : this._id + '.js',
        displayErrors: true,
        timeout: Meteor.settings['private']['labvm']['labruntime_init_timeout']
      }
    };

    private TaskContextOptions(id : string) {
      return {
        filename : id + '.js',
        displayErrors: true,
        timeout: Meteor.settings['private']['labvm']['labruntime_init_timeout']
      }
    }

    public static createLabRuntime(opts : LabFileImportOpts) : Promise<LabRuntime> {
        return new Promise<LabRuntime>((resolve, reject) => {
          // Regex for Markdown in Comments
          const comment_filter = /\/\*( |\n)*?@(.*?)(\n)((.|\n)*?)\*\//gm;
          var tasks = [], comment = [], index = 0;
          while ((comment = comment_filter.exec(opts.file)) !== null){
            tasks.push ({
              name: comment[2].replace(/[^\w\s]/gi, '').trim(), // Remove special characters
              md: comment[4]
            });
          }

          // Uglify JS to minimize Storage
          let code = "";
          try {
            let code = (UglifyJS.minify(opts.file, {fromString: true})).code;
          } catch (e){
            return reject(e);
          }

          // Create LabRuntime
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
        })

        .catch((e) => {
          clientConsole.error(e);
          return e;
        })
    }

    public static getLabRuntime(lab_id : string) : Promise<LabRuntime> {
      return <Promise<LabRuntime>> LabRuntime.cache_keyExists(lab_id).then(function(exists){
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

            let lab_model = Labs.findOne({ _id : lab_id });

            if (_.isNil(lab_model)){
              reject(new Error("Lab Not Found"));

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
            this._code = new vm.Script(lab.file, this.LabContextOptions());
          } catch (e){
            log.info("Error in compiling Lab Object", e);
            return reject(e);
          }
        }

        // Execute Lab
        if (typeof this._code !== 'undefined'){
          try{
            this._code.runInContext(this._context, this.LabContextOptions());
          } catch (e) {
            log.info("Error in executing Lab Object", e);
            return reject(e);
          }
        }

        // Validate LabSandbox
        try {
          isValidLabObject(this._sandbox);
        } catch (e) {
          log.info("Invalid Lab Object", e);
          return reject(e);
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
        log.debug("Lab Runtime | Initializing Lab");

        if (this._sandbox.Lab instanceof Lab){
          this._sandbox.Environment = obj;
          try {
            vm.runInContext("Lab._init(Environment)",this._context, this.LabContextOptions());
          } catch (e){
            clientConsole.error(e);
            obj.error(e);
          }
        } else {
          throw new Error("Invalid Lab");
        }
      });
    }

    /*
      exec_destroy()
    */
    public exec_destroy(obj : InitObject){
       this.ready().then(() => {
         log.debug("Lab Runtime | Destroying Lab");

        if (this._sandbox.Lab instanceof Lab){
          this._sandbox.Environment = obj;
          try {
            vm.runInContext("Lab._destroy(Environment)",this._context, this.LabContextOptions());
          } catch (e) {
            clientConsole.error(e);
            obj.error(e);
          }
        } else {
          throw new Error("Invalid Lab");
        }
      });
    }

    /*
      exec_setup()
    */
    public exec_setup(task_id : number, obj : SetupObject){
       this.ready().then(() => {
          log.debug("Lab Runtime | Setting up Task "+task_id);

         if (!(this._sandbox.Lab instanceof Lab)){
           throw new Error("Invalid Lab");
         } else if (typeof this._sandbox.Lab._tasks[task_id].setup !== "function"){
           throw new Error("Invalid Task");
         } else {
           this._sandbox.Environment = obj;
           try {
             vm.runInContext("Lab._tasks["+task_id+"].setup(Environment);",this._context, this.TaskContextOptions(task_id.toString()));
           } catch (e){
             clientConsole.error(e);
             obj.error(e);
           }
         }
       })
    }

    /*
      exec_verify()
    */
    public exec_verify(task_id : number, obj : VerifyObject){
       this.ready().then(() => {
         log.debug("Lab Runtime | Verifying Task "+task_id);

        if (!(this._sandbox.Lab instanceof Lab)){
          throw new Error("Invalid Lab");
        } else if (typeof this._sandbox.Lab._tasks[task_id].verify !== "function"){
          throw new Error("Invalid Task");
        } else {
          this._sandbox.Environment = obj;
          try {
            vm.runInContext("Lab._tasks["+task_id+"].verify(Environment)",this._context, this.TaskContextOptions(task_id.toString()));
          } catch (e){
            clientConsole.error(e);
            obj.error(e);
          }
        }
      })
    }

 }
