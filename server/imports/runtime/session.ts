/*
* TuxLab Session Class
* Uppermost controller class for a Lab.
* @author: Derek Brown, Cem Ersoz
*/

/* GLOBAL IMPORTS */
import * as fs from 'fs';
import { ConfigService } from '../services/config';

/* ETCD IMPORTS */
import { Etcd } from 'node-etcd';
const etcd_conn_str =
  ConfigService.get('etcd_node_proto')+"://"+
  ConfigService.get('etcd_node_ip')+":"+
  ConfigService.get('etcd_node_port')
const etcd = new Etcd(etcd_conn_str, {
  ca: fs.readFileSync(ConfigService.get('ssl_ca')),
  cert: fs.readFileSync(ConfigService.get('ssl_cert')),
  key: fs.readFileSync(ConfigService.get('ssl_key'))
});

/* SESSION IMPORTS */
import { Users } from '../../../both/collections/user.collection';
import { Task } from '../../../both/models/lab.model';
interface Instruction {
  id: number;
  name: string;
  md: string;
  log: string;
}

import { VMConfigCustom } from '../api/vmconfig';
import { InitObject, SetupObject, VerifyObject } from '../api/environment';

import { Container } from './container';
import { LabRuntime } from './lab_runtime';

export class Session {
  // SessionID
  public session_id;

  // Lab Runtime
  public lab_id : string;
  private _lab : LabRuntime;
  public instructions : Instruction[];
  public current_task = 0;

  // User
  private _user; //user_id
  public getUserObj(){
    return Users.findOne({ _id : this._user });
  }

  // Containers
  private _containers : Container[];

  // Ready Function
  public _onUpdate : (session : Session) => void;

/************************
 *     CONSTRUCTOR      *
 ************************/

  constructor (session_id: string, user_id : string, lab : LabRuntime, containers : Container[]){
    // Set Session ID.  Used for DNS Name and SSH Username.
    this.session_id = session_id;

    this._user = user_id;
    this.lab_id = lab.id;
    this._lab = lab;
    this._containers = containers;

    this.instructions = _.map(this._lab.tasks, function(task){
      let instruction = <Instruction>_.clone(task);
          instruction.log = "";
      return instruction;
    });
  }

/************************
 *    INIT FUNCTION     *
 ************************/
 public init() : void {

 }

/************************
 *    DESTROY FUNCTION  *
 ************************/
 public destroy() : void {

 }

/************************
*    TASK FUNCTIONS     *
************************/
public nextTask() : void {
  this._onUpdate(this);
}

/************************
*  ENVIRONMENT OBJECT  *
************************/

  private getEnvironmentObject(){
    return {
      vm: _.map(this._containers, (container) => {
        container.getVMInterface();
      }),
      error: () => {},
      setLabData: () => {},
      getLabData: () => {},
      getUserProfile: () => {},
    };
  }

  private getTaskObject(){
    return {
      setTaskData: (data : string) => {},
      getTaskData: () => {},

      setMarkdown: (md : string) => {},
      setLog: (md : string) => {}
    };
  }

  private getInitObject(success, failure) : InitObject{
    return new InitObject(_.extend(this.getEnvironmentObject(),
    {
      success: success,
      failure: failure
    }));
  }

  private getSetupObject(success, failure) : SetupObject{
    return new SetupObject(_.extend(this.getEnvironmentObject(),this.getTaskObject(),
    {
      success: success,
      failure: failure
    }));
  }

  private getVerifyObject(completed, failed, retry) : VerifyObject {
    return new VerifyObject(_.extend(this.getEnvironmentObject(),this.getTaskObject(),
    {
      setGrade: (n : number, d : number) => {

      },
      completed: completed,
      failed: failed,
      retry: retry
    }));
  }

  /*
    UTILITY
  */
  public getDefaultContainer(){
    return this._containers[0];
  }

}
