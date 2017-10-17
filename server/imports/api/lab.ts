/*
 * TuxLab Lab Interface
 * TuxLab Class passed to the Instructor to create a Lab.
 * @author: Derek Brown, Cem Ersoz
 */

    /* IMPORTS */
    import * as _ from "lodash";

    import { VMConfig, VMConfigCustom, VMValidateConfig } from './vmconfig';
    import { InitObject, SetupObject, VerifyObject } from './environment';

    /* TASK INTERFACE */
    export type InitFunction = (init : InitObject) => void;
    export type SetupFunction = (setup : SetupObject) => void;
    export type VerifyFunction = (verfiy : VerifyObject) => void;
    export interface Task {
      setup : SetupFunction;
      verify : VerifyFunction;
    }

    /* LAB CLASS */
    export interface LabConstr {
      name: string;
      description? : string;
      vm: VMConfig | VMConfig[];
    }
    export class Lab {
      public name : string;
      public description? : string;
      public _vm : VMConfig[];
      _init : InitFunction = (env) => { env.next(); }
      _destroy : InitFunction = (env) => { env.next(); }
      _tasks : Task[] = [];

      constructor (opts : LabConstr){
        this.name = opts.name;
        this.description = (typeof opts.description !== 'undefined') ? opts.description : "";

        if (isVMConfigArr(opts.vm)){
          this._vm = opts.vm;
        } else {
          this._vm = [opts.vm];
        }
      }

      public init (initFn : InitFunction){
        this._init = initFn;
      }

      public destroy (destroyFn : InitFunction){
        this._destroy = destroyFn;
      }

      public nextTask(task : Task){
          this._tasks.push(task);
      }
    }

    /*
     VALIDATION FUNCTIONS
    */
    function isVMConfigArr(vmc : VMConfig | VMConfig[]) : vmc is VMConfig[] {
      return _.isArray(vmc);
    }

    function isValidTaskObject (task : any) : boolean {
       return (typeof task === "object") &&
              (typeof task.setup === "function") &&
              (typeof task.verify === "function");
    }

    export function isValidLabObject (sandbox : any) : sandbox is { Lab : typeof Lab } {
       if (_.isNil(sandbox)) {
         throw new Error("SandboxUndefined");
       } else if (!_.has(sandbox, "Lab")){
         throw new Error("LabUndefined");
       } else if (!_.has(sandbox, "Lab.name")){
         throw new Error("LabNameUndefined");
       } else if (!_.has(sandbox, "Lab._vm")){
         throw new Error("VMUndefined");
       } else if (!_.has(sandbox, "Lab._tasks")) {
         throw new Error("TaskUndefined");
       } else if (_.every(sandbox.Lab._vm, isValidTaskObject)){
         throw new Error("InvalidTask");
       } else {
         _.every(sandbox.Lab._vm, VMValidateConfig);
         return true;
       }
    }
