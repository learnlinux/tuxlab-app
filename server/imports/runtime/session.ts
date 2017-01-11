/*
 * TuxLab Session Class
 * Uppermost controller class for a Lab.
 * @author: Derek Brown, Cem Ersoz
 */

  import { Task } from '../../../both/models/lab.model';
  interface Instruction {
    id: number;
    name: string;
    md: string;
    log: string;
  }

  import { Container } from './container';
  import { LabRuntime } from './lab_runtime';

  export class Session {
    private _ready : Promise<Session>;

    // Container
    private _container : Container;

    // Lab Runtime
    private _lab : LabRuntime;
    public current_task = 0;
    public instructions : Instruction[];

    constructor (lab : LabRuntime){

      // Copy LabRuntime Data
      this._lab = lab;
      this.instructions = _.map(this._lab.tasks, function(task){
        let instruction = <Instruction>_.clone(task);
            instruction.log = "";
        return instruction;
      });

      // Create Container
    }

    public ready() : Promise<Session> {
      return this._ready;
    }

    public destroy() : void {

    }

    public renew(){

    }

    public nextTask() {

    }
  }
