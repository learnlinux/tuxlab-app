/*
 * TuxLab Lab Class
 * Defines a Lab; the Tasks, Verfiers, and Enviornment
 * @author: Derek Brown, Cem Ersoz
 */

 import * as vm from 'vm';
 import * as _ from "underscore";
 import { UglifyJS } from 'uglify-js';

 import { Lab as LabModel, Task } from '../../../both/models/lab.model';
 import { LabSandbox, isValidLabfile } from './lab.labfile';

 export class Lab implements LabModel {

   // Data Model Elements
   name: string;
   course_id: string;
   file: string;
   tasks: Task[];

   constructor(labFile : string, courseID){
     // Regex for Comments
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
     let code = (UglifyJS.minify(labFile, {fromString: true})).code;

     // Compile and Execute Code
     let LabInstance = _.clone(LabSandbox);
     try {

       // Compile Lab
       let compiled = new vm.Script(code);

       // Run Lab
       compiled.runInNewContext(LabInstance, {timeout: 500});
     } catch (e){
       throw new Error("compilationError");
     }

     // Validate Lab
     if (!isValidLabfile(LabInstance.Lab)){
       throw new Error("undefinedFieldError");
     } else {

     }
   }
 }
