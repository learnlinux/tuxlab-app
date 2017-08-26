/*
 * TuxLab Session Interface
 * Object Passed to the Instructor inside of the Setup Function.
 * @author: Derek Brown, Cem Ersoz
 */

 import * as _ from "lodash";

 import { Profile } from '../../../both/models/user.model';
 import { VM } from './vm';

 export abstract class Environment implements VM {

   // Lab Data Interface
   setLabData : (data : any) => void;
   getLabData : () => void;

   // User Interface
   getUserProfile : () => Profile;
   getUserID() : string {
     return this.getUserID();
   }
   getName() : string{
     return this.getUserProfile().name;
   }
   getOrg() : string{
     return this.getUserProfile().organization;
   }

   // Command Interface for VM
   public vm : VM[];
   private getDefaultVM(){
     if (_.isArray(this.vm) && this.vm.length > 0){
       return this.vm[0];
     } else {
       throw new Error("No VMs");
     }
   }

   // Convenience Methods for Accessing the Default VM
   shell(command : string | string[]) : Promise<[String,String]> {
     return this.getDefaultVM().shell(command);
   }

   // Constructor from Object
   constructor(obj){
     _.extend(this, _.pick(obj, ['error', 'setLabData', 'getLabData', 'getUserProfile', 'vm']));
   }
 }

 /* CLASSES FOR OBJECTS PASSED TO INIT AND DESTROY */
 export class InitObject extends Environment {

   // Setup Progress Interface
    next : () => void; // Continuation Function: Task Ready
    error : (error? : Error) => void; // Continuation Function: Failed to Setup task.

    // Constructor from Object
    constructor(obj){
      super(obj);
      _.extend(this, _.pick(obj, ['next', 'error']));
    }
 }

 /* CLASSES FOR OBJECTS PASSED TO SETUP AND VERIFY FUNCTIONS */
 export abstract class TaskObject extends Environment {

   // Task Data Interface
   setTaskData : (data : string) => void;
   getTaskData : () => string;

   // Markdown Interface
   setFeedback : (md : string) => void; // Updates the markdown feedback

   // Constructor from Object
   constructor(obj){
     super(obj);
     _.extend(this, _.pick(obj, ['setTaskData', 'getTaskData', 'setMarkdown', 'setStatus']));
   }
 }

 export class SetupObject extends TaskObject {

   // Setup Progress Interface
   next : () => void; // Continuation Function: Task Ready
   error : (error? : Error) => void; // Continuation Function: Failed to Setup task.

   // Constructor from Object
   constructor(obj){
     super(obj);
     _.extend(this, _.pick(obj, ['next', 'error']));
   }
 }

 export class VerifyObject extends TaskObject {

   // Lab Progress Interface
   next : () => void; // Continuation Function: Goes to next Task
   fail : () => void; // Continuation Function: Marks lab a failure and exits.
   retry : () => void; // Continuation Function: Prompts user to retry;
   error: (error? : Error) => void; // Continuation Function: Marks Lab as having Erred.

   // Lab Grade Interface
   setGrade : (n : number, d : number) => void; // n : numerator, d: denom

   // Constructor from Object
   constructor(obj){
     super(obj);
     _.extend(this, _.pick(obj, ['next', 'fail', 'retry', 'error', 'setGrade']));
   }
 }
