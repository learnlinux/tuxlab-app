/*
 * TuxLab Lab Interface
 * TuxLab Class passed to the Instructor to create a Lab.
 * @author: Derek Brown, Cem Ersoz
 */

    /* IMPORTS */
    import * as _ from "underscore";

    import { VMConfig, VMConfigCustom, VMValidateConfig } from './vmconfig';
    import { InitObject, SetupObject, VerifyObject } from './environment';

    /* TASK INTERFACE */
    type InitFunction = (init : InitObject) => void;
    type SetupFunction = (setup : SetupObject) => void;
    type VerifyFunction = (verfiy : VerifyObject) => void;
    interface Task {
      setup : SetupFunction;
      verify : VerifyFunction;
    }

    /* LAB CLASS */
    interface LabConstr {
      name: string;
      description? : string;
      vm: VMConfig | VMConfig[];
    }
    export class Lab {
      name : string;
      description? : string;
      _vm : VMConfig[];
      _init : InitFunction = function(env){ env.success(); }
      _destroy : InitFunction = function(env){ env.success(); }
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

      set init (initFn : InitFunction){
        this._init = initFn;
      }

      set destroy (destroyFn : InitFunction){
        this._destroy = destroyFn;
      }

      nextTask(task : Task){
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
       return (typeof task === "Object") &&
              (typeof task.setup === "function") &&
              (typeof task.verify === "function");
    }

    export function isValidLabObject (sandbox : any) : void {
       if (typeof sandbox === "undefined") {
         throw new Error("SandboxUndefined");
       } else if (typeof sandbox.Lab === "undefined"){
         throw new Error("LabUndefined");
       } else if (typeof sandbox.Lab.name === "undefined"){
         throw new Error("LabNameUndefined");
       } else if (typeof sandbox.Lab._vm === "undefined"){
         throw new Error("VMUndefined");
       } else if (typeof sandbox.Lab._tasks === "undefined") {
         throw new Error("TaskUndefined");
       } else if (_.every(sandbox.Lab._vm, isValidTaskObject)){
         throw new Error("InvalidTask");
       } else {
         _.every(sandbox.Lab._vm, VMValidateConfig);
         return;
       }
    }
