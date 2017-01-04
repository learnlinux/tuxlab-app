/*
 * TuxLab Session Interface
 * Object Passed to the Instructor inside of the Setup Function.
 * @author: Derek Brown, Cem Ersoz
 */

 import * as _ from "underscore";

 import { Profile } from '../../../both/models/user.model';
 import { VM } from './vm';

 abstract class Environment {
   
   // Error Handling interface
   abstract error : (err : string) => void; // Prints Error on Screen

   // Lab Data Interface
   abstract setLabData : (data : any) => void;
   abstract getLabData : any;

   // User Interface
   abstract getUserProfile() : Profile;
   getUserID() : string {
     return this.getUserProfile()._id;
   }
   getNickName() : string{
     return this.getUserProfile().nickname;
   }
   getFirstName() : string{
     return this.getUserProfile().first_name;
   }
   getLastName() : string{
     return this.getUserProfile().last_name;
   }
   getSchool() : string{
     return this.getUserProfile().school;
   }

   // Command Interface for VM
   public vm : VM[];

   //TODO Convenience Methods for Default VM
   private getDefaultVM(){
     if (_.isArray(this.vm) && this.vm.length > 0){
       return this.vm[0];
     } else {
       throw new Error("NoVMs");
     }
   }
 }

 /* CLASSES FOR OBJECTS PASSED TO INIT AND DESTROY */
 export abstract class InitObject extends Environment {

   // Setup Progress Interface
   abstract success() : void; // Continuation Function: Task Ready
   abstract faulure() : void; // Continuation Function: Failed to Setup task.

 }

 /* CLASSES FOR OBJECTS PASSED TO SETUP AND VERIFY FUNCTIONS */
 abstract class TaskObject extends Environment {

   // Task Data Interface
   abstract setTaskData() : (data : string) => void;
   abstract getTaskData() : string;

   // Markdown Interface
   abstract setMarkdown() : (md : string) => void; // Updates the Instructions themselves
   abstract setStatus() : (md : string) => void; // Updates only the "status area" of the instructions

 }

 export abstract class SetupObject extends TaskObject {

   // Setup Progress Interface
   abstract success() : void; // Continuation Function: Task Ready
   abstract faulure() : void; // Continuation Function: Failed to Setup task.

 }

 export abstract class VerifyObject extends TaskObject {

   // Lab Progress Interface
   abstract completed() : void; // Continuation Function: Goes to next Task
   abstract failed() : void; // Continuation Function: Marks lab a failure and exits.
   abstract retry() : void; // Continuation Function: Prompts user to retry;

   // Lab Grade Interface
   abstract setGrade() : (n : number, d : number) => void; // n : numerator, d: denom

 }
