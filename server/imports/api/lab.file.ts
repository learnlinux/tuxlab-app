/*
 * TuxLab LabFile Interface
 * Defines a Lab; the Tasks, Verfiers, and Enviornment
 * @author: Derek Brown, Cem Ersoz
 */

 import * as _ from "underscore";

 import { ENV } from './env';
 import { VM } from './vm';

 /*
   LABFILE INTERFACE
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
    _init?: SetupFunction;
    _destroy?: SetupFunction;
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

    public nextTask(t : TaskConstr){
      this._tasks.push(t);
    }
 }

 /*
  VALIDATION FUNCTIONS
 */
 function isValidTaskObject (task : any) : boolean {
    return (typeof task === "Object") &&
           (typeof task.setup === "function") &&
           (typeof task.verify === "function");
 }

 export function isValidLabObject (sandbox : any) : void {
    if (typeof sandbox === "undefined") {
      throw new Error("SandboxUndefined");
    } else if (typeof sandbox.Lab === "undefined"){
      throw new Error("LabUndefined");
    } else if (typeof sandbox.Lab.name === "undefined"){
      throw new Error("LabNameUndefined");
    } else if (typeof sandbox.Lab._vm === "undefined"){
      throw new Error("VMUndefined");
    } else if (typeof sandbox.Lab._tasks === "undefined") {
      throw new Error("TaskUndefined");
    } else if (_.every(sandbox.Lab._vm, isValidTaskObject)){
      throw new Error("InvalidTask");
    } else {
      _.every(sandbox.Lab._vm, VM.validateConfig);
      return;
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
