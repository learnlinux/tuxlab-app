/*
 * TuxLab Lab Interface
 * TuxLab Class passed to the Instructor to create a Lab.
 * @author: Derek Brown, Cem Ersoz
 */

    /* IMPORTS */
    import * as _ from "underscore";

    import { VMConfig } from './vm';
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
      description? : string = "";
      _vm : VMConfig[];
      _init : InitFunction = function(env){ env.success(); }
      _destroy : InitFunction = function(env){ env.success(); }
      _tasks : Task[] = [];

      constructor (opts : LabConstr){
        this.name = opts.name;
        this.description = (typeof opts.description !== 'undefined') ? opts.description : "";

        if (_.isArray(opts.vm)){
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
