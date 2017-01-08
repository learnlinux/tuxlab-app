/*
 * TuxLab Lab Runtime Class
 * Given a lab model, sets up the cache to
 * @author: Derek Brown, Cem Ersoz
 */

 import * as _ from "underscore";
 import * as vm from 'vm';
 import { UglifyJS } from 'uglify-js';

 import { TuxConfig } from '../services/config.service';
 import { Lab as LabModel, Task as TaskModel } from '../../../both/models/lab.model';
 import { Lab, isValidLabObject } from '../api/lab'

 /**
  Exports Modules for use by Instructors in Labfile
 **/
 export const LabSandbox = {
   Lab: Lab
 }

 /**
  Constructor Options for LabRuntime
 **/
 interface LabRuntimeConstr{
   name?: string;
   course_id: string;
   file: string;
   tasks: TaskModel[];
 }

 export class LabRuntime implements LabModel {

    // Lab Model Elements
    name: string;
    course_id: string;
    file: string;
    tasks: TaskModel[];

    // Runtime Elements
    private _sandbox = _.clone(LabSandbox);
    private _context = vm.createContext(this._sandbox);
    private _code;

    constructor(lab : LabRuntimeConstr){

      // Compile Lab
      if (typeof lab.file === "string" && lab.file !== ""){
        try{
          this._code = new vm.Script(lab.file, {
              displayErrors: true,
              timeout: TuxConfig.get('labruntime_init_timeout')
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

    }

    public static labfileImport(labFile : string, courseID : string) : LabRuntime {

      // Regex for Markdown in Comments
      const comment_filter = /\/\*( |\n)*?@(.*?)( |\n)((.|\n)*?)\*\//gm;
      const title_filter = /\/\*( |\n)*?@(.*?)( |\n)((.|\n)*?)\*\//gm;

      let comments = labFile.match(comment_filter);
      let tasks = comments.map(function(comment, index, arr) {
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
        let code = (UglifyJS.minify(labFile, {fromString: true})).code;
      } catch (e){
        throw new Error("uglifyError");
      }

      // Create LabInstance
      return new LabRuntime({
        course_id: courseID,
        file: code,
        tasks: tasks
      });
    }
 }
