/*
 * TuxLab Lab Runtime Class
 * Given a lab model, sets up the cache to
 * @author: Derek Brown, Cem Ersoz
 */

 import * as _ from "underscore";
 import * as vm from 'vm';
 import * as UglifyJS from 'uglify-js';

 import { ConfigService } from '../services/config';

 import { VMConfig, VMResolveConfig, VMConfigCustom } from '../api/vmconfig';
 import { Lab as LabModel, Task as TaskModel, LabStatus } from '../../../both/models/lab.model';
 import { Lab, isValidLabObject } from '../api/lab'

 /**
  LabSandbox
  Exports Modules for use by Instructors in Labfile
 **/
 //TODO test injecting into TuxLab Object
 export const LabSandbox = {
   TuxLab: Lab,
   Lab: {}
 }

 /**
  labFileImportOpts
  Sets options for creating a labfile
 **/
 export interface LabFileImportOpts{
   _id?: string;
   name: string;
   course_id: string;
   file: string;
 }

 export class LabRuntime implements LabModel {

    // Lab Model Elements
    _id : string = "";
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

    public static fileImport(opts : LabFileImportOpts) : Promise<LabRuntime> {
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
      });
    }

    public ready() : Promise<LabRuntime> {
      return this._ready;
    }

    public toLabObject() : LabModel {
      return _.pick(this, ['_id', 'name', 'course_id', 'updated', 'status', 'file', 'tasks']);
    }

    public getVMConfig() : Promise<VMConfigCustom[]> {
      return this.ready().then(() => {
        if (this._sandbox.Lab instanceof Lab){
          return _.map(this._sandbox.Lab._vm, VMResolveConfig);
        }
      });
    }

 }
