/*
 * TuxLab Lab Runtime Class
 * Given a lab model, sets up the cache to
 * @author: Derek Brown, Cem Ersoz
 */

 import * as _ from "underscore";
 import * as vm from 'vm';

 import { VMConfig, VMResolveConfig, VMConfigCustom } from '../api/vmconfig';
 import { Lab, isValidLabObject } from '../api/lab'
 import { ConfigService } from '../services/config';

 import { Lab as LabModel, Task as TaskModel, LabStatus } from '../../../both/models/lab.model';

 /**
  LabSandbox
  Exports Modules for use by Instructors in Labfile
 **/
 //TODO test injecting into TuxLab Object
 export const LabSandbox = {
   TuxLab: Lab,
   Lab: {}
 }

 export class LabRuntime implements LabModel {

    // Lab Model Elements
    id : string = "";
    name: string;
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

    constructor(lab : LabModel){
      this._ready = new Promise((resolve, reject) => {
        // Compile Lab
        if (typeof lab.file === "string" && lab.file !== ""){
          try{
            this._code = new vm.Script(lab.file, {
                displayErrors: true,
                timeout: ConfigService.get('labruntime_init_timeout')
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

        // Set Parameters
        Object.assign(this, lab);
        resolve(this);
      });
    }

    public ready() : Promise<LabRuntime> {
      return this._ready;
    }

    public getVMConfig() : Promise<VMConfigCustom[]> {
      return this.ready().then(() => {
        if (this._sandbox.Lab instanceof Lab){
          return _.map(this._sandbox.Lab._vm, VMResolveConfig);
        }
      });
    }

 }
