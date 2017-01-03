/*
 * TuxLab LabFile Interface
 * Defines a Lab; the Tasks, Verfiers, and Enviornment
 * @author: Derek Brown, Cem Ersoz
 */

 import { Lab } from '../../../both/models/lab.model';
 import { ENV } from './env';
 import { VM } from './vm';

 /*
   LAB INTERFACE
 */
 export interface SetupObject {
   continue: void;
   repeat?: void;
   error : (err : string) => void;
   setGrade : (n : number, d : number) => void;
   setMarkdown : (md : string) => void; // Updates the Instructions themselves
   setStatus : (md : string) => void; // Updates only the "status area" of the instructions
 }
 export type SetupFunction = (env : ENV, res : SetupObject) => void;
 export type VerifyFunction = (env : ENV, res: SetupObject) => void;

  interface TaskConstr {
   name?: string;
   markdown?: string;
   setup: SetupFunction;
   verify: VerifyFunction;
 }

 interface LabConstr {
   name: string;
   description? : string;
   vm: VM.Config | VM.Config[];
 }
 export abstract class LabFile {
    name: string;
    description? : string = "";
    _vm: VM.Config | VM.Config[];
    _init: SetupFunction;
    _destroy: SetupFunction;
    _tasks: TaskConstr[] = [];

    constructor(options : LabConstr){
      this.name = options.name;
      this.description = (typeof options.description !== 'undefined') ? options.description : "";
      this._vm = options.vm;
    }

    set init(initFn : SetupFunction){
      this._init = initFn;
    }

    set destroy(destroyFn : SetupFunction){
      this._destroy = destroyFn;
    }

    public nextTask(t : Task){
      this._tasks.push(t);
    }
 }

 /*
   LABFILE SANDBOX
   Defines objects accessible to the instructors in writing labfiles.
   TODO: Add some more of these
 */
 export const LabSandbox = {
   Lab: LabFile
 }

 /*
   LABFILE VALIDATOR
 */
 export function isValidLabfile (lab : LabFile){
     return (lab instanceof LabFile) &&
     (typeof lab.name !== "undefined") &&
     (typeof lab.description !== "undefined") &&
     (typeof lab.vm !== "undefined") &&
     (typeof lab._init !== "undefined") &&
     (typeof lab._destroy !== "undefined") &&
     (typeof lab._tasks !== "undefined");
 }
