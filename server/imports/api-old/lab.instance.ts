/*
 * TuxLab Lab Class
 * Defines a Lab; the Tasks, Verfiers, and Enviornment
 * @author: Derek Brown, Cem Ersoz
 */

 import * as vm from 'vm';
 import * as _ from "underscore";
 import { UglifyJS } from 'uglify-js';

 import { VM } from './vm';
 import { LabModel, TaskModel } from '../../../both/models/lab.model';
 import { LabSandbox, isValidLabObject } from './lab.file';


interface LabInstanceConstr{
  name?: string;
  course_id: string;
  file: string;
  tasks: TaskModel[];
}
 export class LabInstance implements LabModel {
   // Lab Model Elements
   public name: string;
   public course_id: string;
   public file: string;
   public tasks: Task[];

   // Runtime Elements
   private _sandbox = _.clone(LabSandbox);
   private _context = vm.createContext(this._sandbox);
   private _code;

   constructor(lab : LabInstanceConstr){

     // Compile Lab
     if (typeof lab.file === "string" && lab.file !== ""){
       try{
         this._code = new vm.Script(lab.file, {
             displayErrors: true,
             timeout: 5000 //TODO: Make nconf variable
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

   public static labfileImport(labFile : string, courseID : string) : LabInstance {

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
     return new LabInstance({
       course_id: courseID,
       file: code,
       tasks: tasks
     });
   }
 }