/*
 * TuxLab Session Interface
 * Object Passed to the Instructor inside of the Setup Function.
 * @author: Derek Brown, Cem Ersoz
 */

 import * as _ from "underscore";

 import { Profile } from '../../../both/models/user.model';
 import { VM } from './vm';

 abstract class Environment implements VM {

   // Error Handling interface
   error : (err : string) => void; // Prints Error on Screen

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
       throw new Error("NoVMs");
     }
   }

   // Convenience Methods for Accessing the Default VM
   shell(command : string) : Promise<[String,String]> {
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
    success : () => void; // Continuation Function: Task Ready
    failure : () => void; // Continuation Function: Failed to Setup task.

    // Constructor from Object
    constructor(obj){
      super(obj);
      _.extend(this, _.pick(obj, ['succcess', 'failure']));
    }
 }

 /* CLASSES FOR OBJECTS PASSED TO SETUP AND VERIFY FUNCTIONS */
 abstract class TaskObject extends Environment {

   // Task Data Interface
   setTaskData : (data : string) => void;
   getTaskData : () => string;

   // Markdown Interface
   setMarkdown : (md : string) => void; // Updates the Instructions themselves
   setLog : (md : string) => void; // Updates only the "status area" of the instructions

   // Constructor from Object
   constructor(obj){
     super(obj);
     _.extend(this, _.pick(obj, ['setTaskData', 'getTaskData', 'setMarkdown', 'setStatus']));
   }
 }

 export class SetupObject extends TaskObject {

   // Setup Progress Interface
   success : () => void; // Continuation Function: Task Ready
   failure : () => void; // Continuation Function: Failed to Setup task.

   // Constructor from Object
   constructor(obj){
     super(obj);
     _.extend(this, _.pick(obj, ['succcess', 'failure']));
   }
 }

 export class VerifyObject extends TaskObject {

   // Lab Progress Interface
   completed : () => void; // Continuation Function: Goes to next Task
   failed : () => void; // Continuation Function: Marks lab a failure and exits.
   retry : () => void; // Continuation Function: Prompts user to retry;

   // Lab Grade Interface
   setGrade : (n : number, d : number) => void; // n : numerator, d: denom

   // Constructor from Object
   constructor(obj){
     super(obj);
     _.extend(this, _.pick(obj, ['completed', 'failed', 'retry', 'setGrade']));
   }
 }
